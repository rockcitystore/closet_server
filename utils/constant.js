module.exports = {
    "NO_LOGIN": 0, // 未登录
    "LOAD_PERMISSION_ERROR": 1, // 获取用户权限失败
    "AUTH_FAIL": 2, // 认证失败
    "SUCCESS": -1, // 成功
    "RUNTIME_ERROR": -2, // 程序运行时异常
    "PARAMS_ERROR": -3, // 参数
    "USB_KEY_INVALID": -4, // Ukey失效
    "UPLOAD_TYPE_ERROR": -5, // 上传文件类型错误
    "UPLOAD_SIZE_ERROR": -6, // 上传文件大小错误
    "NO_DATA": -7, // 无数据
    "PARAMS_EMPTY": -8, // 参数为空
    "PARAMS_NOT_EMAIL": -9, // 参数为空
    "PARAMS_NOT_PHONE": -10, // 参数不是手机号
    "PARAMS_NOT_NUMBER": -11, // 参数必须为数字
    "PARAMS_NOT_LENGTH": -12, // 参数太长
    "PARAMS_NOT_LENRANGE": -13, // 参数长度不合法
    "PARAMS_NOT_JSON": -14, // 参数必须为Json格式
    "PHONE_EXISTS": -15, // 手机已存在
    "PHONE_CODE_WAIT": -16, // 手机验证码间隔太短 等待
    "USB_KEY_NOT_EXISTS": -17, // UKEY不存在
    "AUTH_INVALID": -18, // 验证失效
    "TIMEOUT": -19, // 超时
    "SMS_SEND_DAY_LIMIT": -20, // 发送短信限制
    "SMS_SEND_ERROR": -21, // 短信平台发送失败
    "DATABASE_ERROR": -22, // 操作数据库异常
    "CACHE_ERROR": -23, // 操作缓存异常
    "OSS_ERROR": -24, // 上传到OSS失败
    "EXISTS":-25,//数据已存在
    "VALRANGE_ERROR":-26,//取值超出范围
    "VALUE_ERROR":-27,//取值错误
    "OFFLINE":-30,//审核中
    "NO_PERMISSION": 99 // 没有权限
    ,msg:{
        "NO_LOGIN": '未登录', // 未登录
        "LOAD_PERMISSION_ERROR": '获取用户权限失败', // 获取用户权限失败
        "AUTH_FAIL": '未登录', // 认证失败
        "SUCCESS": '成功', // 成功
        "RUNTIME_ERROR":'系统错误，请稍后再试', // 程序运行时异常
        "PARAMS_ERROR": '参数错误', // 参数
        "USB_KEY_INVALID": 'Ukey失效', // Ukey失效
        "UPLOAD_TYPE_ERROR": '文件类型错误', // 上传文件类型错误
        "UPLOAD_SIZE_ERROR": '文件大小错误', // 上传文件大小错误
        "NO_DATA": '查询不到信息', // 无数据
        "PARAMS_EMPTY": '参数为空', // 参数为空
        "PARAMS_NOT_EMAIL": '非邮箱地址格式', // 参数为空
        "PARAMS_NOT_PHONE": '非手机号码格式', // 参数不是手机号
        "PARAMS_NOT_NUMBER": '参数必须为数字', // 参数必须为数字
        "PARAMS_NOT_LENGTH": '参数太长', // 参数太长
        "PARAMS_NOT_LENRANGE": '参数长度不合法', // 参数长度不合法
        "PARAMS_NOT_JSON": '数据错误', // 参数必须为Json格式
        "PHONE_EXISTS": '手机已存在', // 手机已存在
        "PHONE_CODE_WAIT": '手机验证码间隔短，请稍后再试', // 手机验证码间隔太短 等待
        "USB_KEY_NOT_EXISTS": 'UKEY不存在', // UKEY不存在
        "AUTH_INVALID": '验证失效', // 验证失效
        "TIMEOUT": '网络连接超时，请稍后再试', // 超时
        "SMS_SEND_DAY_LIMIT": '发送短信验证码已达上限，请明日再试', // 发送短信限制
        "SMS_SEND_ERROR": '短信平台发送失败', // 短信平台发送失败
        "DATABASE_ERROR": '数据错误', // 操作数据库异常
        "CACHE_ERROR": '数据错误', // 操作缓存异常
        "OSS_ERROR": '文件上传失败', // 上传到OSS失败
        "EXISTS":'数据已存在',//数据已存在
        "VALRANGE_ERROR":'取值超出范围',//取值超出范围
        "VALUE_ERROR":'取值错误',//取值错误
        "NO_PERMISSION": '没有权限' // 没有权限
    }
};
