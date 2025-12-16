/**
 * HTTP 代理配置模块
 * 提供预配置的 axios 实例，自动应用代理设置
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');

class ProxyConfig {
  constructor() {
    this.proxyUrl = null;
    this.configLoaded = false;
    this.axiosInstance = null;
    this.createAxiosInstance();
  }

  /**
   * 获取配置文件路径
   */
  getConfigPath() {
    // 使用与 main.js 相同的配置文件路径
    try {
      const {app} = require('electron');
      const userDataPath = app.getPath('userData');
      return path.join(userDataPath, 'windsurf-app-config.json');
    } catch (error) {
      // 如果在渲染进程或无法获取 app，使用备用路径
      const userDataPath = path.join(os.homedir(), '.windsurf-tool');
      return path.join(userDataPath, 'windsurf-app-config.json');
    }
  }

  /**
   * 从配置文件加载代理设置
   */
  loadProxyFromConfig() {
    if (this.configLoaded) {
      return this.proxyUrl;
    }

    try {
      const configPath = this.getConfigPath();
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configData);
        this.proxyUrl = config.httpProxy || null;
        this.configLoaded = true;
      }
    } catch (error) {
      console.warn('[代理配置] 加载代理配置失败:', error.message);
    }

    return this.proxyUrl;
  }

  /**
   * 创建或更新 axios 实例
   */
  createAxiosInstance() {
    const proxyUrl = this.loadProxyFromConfig();

    if (proxyUrl) {
      try {
        const {HttpsProxyAgent} = require('https-proxy-agent');
        const agent = new HttpsProxyAgent(proxyUrl);

        this.axiosInstance = axios.create({
          httpsAgent: agent,
          proxy: false
        });

        console.log('[代理配置] 已创建带代理的 axios 实例:', proxyUrl);
      } catch (error) {
        console.warn('[代理配置] 创建代理 axios 实例失败:', error.message);
        this.axiosInstance = axios.create();
      }
    } else {
      this.axiosInstance = axios.create();
      console.log('[代理配置] 已创建默认 axios 实例（无代理）');
    }
  }

  /**
   * 重新加载代理配置（用于配置更新后）
   */
  reloadProxy() {
    this.configLoaded = false;
    this.createAxiosInstance();
    return this.proxyUrl;
  }

  /**
   * 获取预配置的 axios 实例
   * @returns {AxiosInstance} 配置了代理的 axios 实例
   */
  getAxios() {
    return this.axiosInstance;
  }

  /**
   * 获取当前代理URL
   */
  getProxyUrl() {
    return this.loadProxyFromConfig();
  }
}

// 导出单例
const proxyConfig = new ProxyConfig();

module.exports = proxyConfig;
