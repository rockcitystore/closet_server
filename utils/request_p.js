/**
 * 德基APP DNS智能选路
 *
 * Created by leovs on 2016/1/31.
 */
var Promise = require('bluebird');
 // var request = require('request');
//var request = require('requestretry');
var request = Promise.promisifyAll(require("request"));

// var dns = require('dns');
var dns = Promise.promisifyAll(require("dns"));

var extend = require('util')._extend;
var logger = require("../utils/logger").getLogger('request_p');
var httpdnsurl = require("../config").httpdns;
var domains = {}; // domain 缓存
var timeCounter = 0; // 时间计数器
var httpDns = (function () {

    // 记录缓存时间
    setInterval(function () {
        timeCounter++;
    }, 1000);

    return {};
})();

/**
 * 截取URL中的Domain
 *
 * @param uri
 * @returns {*}
 */
httpDns.getDomian = function (uri) {
    return new Promise(function (resolve, reject) {
        var t =/[http|https]:\/\/([^\/|:]+)/g.exec(uri)[1];
        resolve(t);
    });
};

/**
 * 从传统DNS中获取ip
 *
 * @param dn
 * @param callback
 */
httpDns.getbyDns = function (dn) {
    return dns.resolveAsync(dn)
        // .then(function(){
        //
        // })
        // .catch(function(err){
        //
        // })
};

/**
 * 从HTTPDNS中获取有效IP
 *
 * @param dn
 * @param callback
 * @returns {*}
 */
httpDns.getbyHttp = function (dn,method){
        var options = {
            //url: "http://120.27.185.245/d?dn=" + dn,
            url: httpdnsurl+"d?dn=" + dn,
            timeout: 2000 // 两秒如果没有返回ip，放弃
        };
    return request.getAsync(options.url,options)
        .then(function(data){
         if(data.body) return JSON.parse(data.body);
         return '';
    });

};

/**
 * 缓存dns
 * @param dn
 * @param ips
 */
httpDns.cacheDomain = function (uri, dn, ips, ttl) {
    return new Promise(function (resolve, reject) {
        resolve(domains[dn] = {uri: uri.replace(dn, ips[0]), dn: dn, ip: ips[0], ttl: timeCounter + ttl});
    });
};

/**
 * 处理domian
 *
 * @param dn
 * @param ips
 */
httpDns.processDomain = function (uri, dn, ips, ttl) {
    return new Promise(function (resolve, reject) {
        if (uri && dn && ips && ips.length > 0) {
            resolve(httpDns.cacheDomain(uri, dn, ips));
        } else {
            reject('processDomain reject'); // 处理失败
        }
    });
};

/**
 * 取有效的dns
 *
 * @param dn
 * @param callback
 */
httpDns.intactDomain = function (uri, method) {
    return httpDns.getDomian(uri)
            .then(function(dn){
            var domain = domains[dn];
                // 判断domain是否存在缓存并且缓存在有效时间内
            if (domain == null || !domain.dn || domain.ttl < timeCounter) {
                // 如果不在优先找httpdns获取
                return httpDns.getbyHttp(dn,method)
                    .then(function(ips){
                        // 如果失败， 从传统dns获取
                        if ( !ips || ips.length < 1){
                            return httpDns.getbyDns(dn)
                                .then(function(ip){
                                    if (!ip || ip.length < 1) {
                                        return domain;
                                    }else{
                                        return httpDns.processDomain(uri, dn, ip, 600);
                                    }
                                })
                        }else{
                            return httpDns.processDomain(uri, dn, ips, 30);
                        }
                    })
            } else {
                return httpDns.processDomain(uri, dn, [domain.ip], 30);
            }
        });

};

/**
 * request 请求
 *
 * @param method
 * @param uri
 * @param options
 * @param callback
 */
httpDns.request = function (method, uri, options) {
       return httpDns.intactDomain(uri,method)
            .then(function (domain) {
                    options = extend(options, {
                        headers: extend(
                            options.headers || {},
                            {"content-type": (options.json ? "application/json;charset=UTF-8" : "text/xml;charset=UTF-8")}
                        ),
                        method: (method || "GET"),
                        url: uri
                    });
                    if (domain) {
                        options.url = domain.uri;
                        options.headers.host = domain.dn;
                    }
                return options;
                })
           .then(function(op){
            return request[method](op.url,op);
             })
};

// 配置各种请求方式的接口支持
["getAsync","postAsync","delAsync","putAsync","headAsync","patchAsync"].forEach(function (method) {
    module.exports[method] = function (uri, options) {
       return httpDns.request(method, uri, options);
    }
});