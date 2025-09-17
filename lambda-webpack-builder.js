const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const AdmZip = require('adm-zip'); // Biblioteca para descompactar ZIP

// Configurar AWS SDK
const s3 = new AWS.S3();

// Configurações
const BUCKET_NAME = 'lambda-webpack-templates-test'; // Seu bucket S3
const TEMPLATES_PREFIX = 'templates/';
const WEBSITES_PREFIX = 'websites/';

exports.handler = async (event) => {
    console.log('🚀 React Template Builder started');
    console.log('📋 Event received:', JSON.stringify(event, null, 2));
    
    const startTime = Date.now();
    
    try {
        // Validar input
        const { templateName, projectName, config } = event;
        if (!templateName || !projectName) {
            throw new Error('templateName and projectName are required');
        }
        console.log(`📦 Building project: ${projectName} using template: ${templateName}`);
        
        // 1. Baixar template do S3
        console.log('📥 Downloading template from S3...');
        const templatePath = await downloadTemplate(templateName);
        
        // 2. Aplicar configuração customizada
        console.log('⚙️ Applying custom configuration...');
        await applyConfiguration(templatePath, config || {});
        
        // 3. Executar webpack build (dependências de build já estão no Layer)
        console.log('🔨 Running webpack build...');
        const buildResult = await runWebpackBuild(templatePath);
        
        // 4. Upload do site gerado para S3
        console.log('📤 Uploading generated website to S3...');
        const websiteUrl = await uploadWebsite(projectName, path.join(templatePath, 'dist'));
        
        const duration = Date.now() - startTime;
        const response = {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                projectName,
                templateName,
                websiteUrl,
                buildResult,
                timing: {
                    duration: `${duration}ms`,
                    started: new Date(startTime).toISOString(),
                    finished: new Date().toISOString()
                },
                environment: {
                    region: process.env.AWS_REGION,
                    functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
                    memory: process.memoryUsage()
                }
            }, null, 2)
        };
        console.log('✅ Build completed successfully');
        console.log(`⏱️ Total duration: ${duration}ms`);
        return response;
        
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error('❌ Build failed:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack,
                timing: {
                    duration: `${duration}ms`,
                    failedAt: new Date().toISOString()
                }
            }, null, 2)
        };
    }
};

// Função para baixar e descompactar template do S3
async function downloadTemplate(templateName) {
    const templateKey = `${TEMPLATES_PREFIX}${templateName}.zip`;
    const tempDir = `/tmp/${templateName}-${Date.now()}`;
    const zipPath = `${tempDir}.zip`;
    try {
        await fs.mkdir(tempDir, { recursive: true });
        // Baixar ZIP do S3
        console.log(`📁 Downloading ${templateKey} from S3...`);
        const object = await s3.getObject({ Bucket: BUCKET_NAME, Key: templateKey }).promise();
        await fs.writeFile(zipPath, object.Body);
        // Extrair ZIP usando adm-zip
        console.log('📦 Extracting template...');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(tempDir, true);
        console.log(`✅ Template extracted to ${tempDir}`);
        return tempDir;
    } catch (error) {
        console.error('❌ Error downloading template:', error);
        throw new Error(`Failed to download template: ${error.message}`);
    }
}

// Função para aplicar configuração customizada
async function applyConfiguration(templatePath, config) {
    try {
        const configPath = path.join(templatePath, 'template-config.json');
        let templateConfig = {};
        try {
            const configContent = await fs.readFile(configPath, 'utf8');
            templateConfig = JSON.parse(configContent);
        } catch (error) {
            console.log('⚠️ No template-config.json found, using defaults');
        }
        const finalConfig = { ...templateConfig.customizable, ...config };
        // Substituir placeholders no HTML
        const htmlPath = path.join(templatePath, 'public', 'index.html');
        let htmlContent = await fs.readFile(htmlPath, 'utf8');
        if (finalConfig.siteName) {
            htmlContent = htmlContent.replace(/{{SITE_TITLE}}/g, finalConfig.siteName);
        }
        if (finalConfig.siteDescription) {
            htmlContent = htmlContent.replace(/{{SITE_DESCRIPTION}}/g, finalConfig.siteDescription);
        }
        await fs.writeFile(htmlPath, htmlContent);
        // Criar arquivo de configuração para o React
        const reactConfigPath = path.join(templatePath, 'src', 'config.js');
        const reactConfig = `export const SITE_CONFIG = ${JSON.stringify(finalConfig, null, 2)};\n`;
        await fs.writeFile(reactConfigPath, reactConfig);
        console.log('✅ Configuration applied successfully');
    } catch (error) {
        console.error('❌ Error applying configuration:', error);
        throw new Error(`Failed to apply configuration: ${error.message}`);
    }
}

// Função para executar webpack build
async function runWebpackBuild(templatePath) {
    try {
        const buildStart = Date.now();
        // NÃO rodar npm install! As dependências de build já estão no Layer.
        // Executar webpack build
        console.log('⚡ Running webpack build...');
        const { execSync } = require('child_process');
        const buildOutput = execSync('npx webpack --mode production', {
            cwd: templatePath,
            encoding: 'utf8',
            timeout: 300000 // 5 minutos
        });
        const buildDuration = Date.now() - buildStart;
        // Verificar se dist foi criado
        const distPath = path.join(templatePath, 'dist');
        const distExists = await fs.access(distPath).then(() => true).catch(() => false);
        if (!distExists) {
            throw new Error('Build completed but dist directory was not created');
        }
        const distFiles = await fs.readdir(distPath);
        console.log(`✅ Webpack build completed in ${buildDuration}ms`);
        console.log(`📁 Generated files: ${distFiles.join(', ')}`);
        return {
            duration: buildDuration,
            outputFiles: distFiles,
            buildOutput: buildOutput.substring(0, 1000) // Truncar output
        };
    } catch (error) {
        console.error('❌ Webpack build failed:', error);
        throw new Error(`Webpack build failed: ${error.message}`);
    }
}

// Função para upload do site gerado
async function uploadWebsite(projectName, distPath) {
    try {
        const uploadStart = Date.now();
        const websitePrefix = `${WEBSITES_PREFIX}${projectName}/`;
        const files = await getFilesRecursively(distPath);
        console.log(`📤 Uploading ${files.length} files to S3...`);
        const uploadPromises = files.map(async (file) => {
            const relativePath = path.relative(distPath, file);
            const s3Key = `${websitePrefix}${relativePath.replace(/\\/g, '/')}`;
            const fileContent = await fs.readFile(file);
            const contentType = getContentType(file);
            return s3.putObject({
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: fileContent,
                ContentType: contentType,
                CacheControl: 'max-age=31536000'
            }).promise();
        });
        await Promise.all(uploadPromises);
        const uploadDuration = Date.now() - uploadStart;
        const websiteUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${websitePrefix}index.html`;
        console.log(`✅ Website uploaded in ${uploadDuration}ms`);
        console.log(`🌐 Website URL: ${websiteUrl}`);
        return websiteUrl;
    } catch (error) {
        console.error('❌ Upload failed:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }
}

// Função auxiliar para listar arquivos recursivamente
async function getFilesRecursively(dir) {
    const files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files.push(...await getFilesRecursively(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

// Função auxiliar para determinar Content-Type
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    return contentTypes[ext] || 'application/octet-stream';
}