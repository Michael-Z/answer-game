import Vue from 'vue';

export function debounce(func, delay, immediate){
    let timer = -1;
    return function(){
        if(immediate && timer === -1){
            timer = null;
            func();
        }else{
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        }
    }
}

export function useComponents(components){
    components.forEach(component =>{
        Vue.use(component);
    });
}

/**
 * 转换时间
 * @param time
 * @param type  hms|ymd, hms返回的是hh:mm:ss，ymd返回的是年月日yy-mm-dd，不传返回yy-mm-dd hh:mm:ss
 * @returns {string}
 */
export function formatTime(time, type = ''){
    if(time){
        const date = new Date(time);
        let y = date.getFullYear(),
            m = date.getMonth() + 1 < 10? '0' + (date.getMonth() + 1): (date.getMonth() + 1),
            d = date.getDate() < 10? '0' + date.getDate(): date.getDate(),
            h = date.getHours() < 10? '0' + date.getHours(): date.getHours(),
            min = date.getMinutes() < 10? '0' + date.getMinutes(): date.getMinutes(),
            s = date.getSeconds() < 10? '0' + date.getSeconds(): date.getSeconds();
        switch(type){
            case 'hms':
                return h + ':' + min + ':' + s;
            case 'ymd':
                return y + '-' + m + '-' + d;
            default:
                return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
        }
    }else{
        return '';
    }

}

/**
 * 验证身份证号码
 * @param idCard
 * @returns {string}
 */
export function validateIdCard(idCard){
    const rule = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
    return idCard.match(rule);
}

/**
 * 验证手机号
 * @param mobile
 * @returns {string}
 */
export function validateMobile(mobile){
    const mobileRule = /^1[0-9]{10}$/;
    return mobile.match(mobileRule);
}

export function validateEmail(email) {
    const emailRule = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
    return email.match(emailRule);
}

/**
 * 去空格
 * @param time
 * @returns {string}
 */
export function trim(str){
    return str.replace(/\s*/g, "");
}