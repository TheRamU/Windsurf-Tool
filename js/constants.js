/**
 * 全局常量配置
 */
const CONSTANTS = {
  
  // Firebase API
  FIREBASE_LOGIN_API: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
  FIREBASE_REFRESH_TOKEN_API: 'https://securetoken.googleapis.com/v1/token',
  
  // Firebase API Key
  FIREBASE_API_KEY: 'AIzaSyDsOl-1XpT5err0Tcnx8FFod1H8gVGIycY',
  
  // Windsurf 注册 API
  WINDSURF_REGISTER_API: 'https://register.windsurf.com/exa.seat_management_pb.SeatManagementService/RegisterUser',
  
  // 请求超时时间 (ms)
  REQUEST_TIMEOUT: 30000
};

module.exports = CONSTANTS;
