export const map = (value, a, b, c, d) => {
    const temp = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return Math.round(c + temp * (d - c)); // then map it from (0..1) to (c..d) and return it
}
export const constrain = (value, a, b) => {
    if(value < a) return a;
    else if(value > b) return b;
    return value;
}
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export const $ = (cssSelector) => document.querySelector(cssSelector);
export const $all = (cssSelector) => document.querySelectorAll(cssSelector);
export const create = (tagName, className, content) => {
   const element = document.createElement(tagName);
   element.classList.add(className);
   element.textContent = content;
   return element;
}

export const resetTransforms = (ctx) => ctx.setTransform(1, 0, 0, 1, 0, 0);

export const closeNav = () => {
    $('#rLeft').classList.remove('rLeft');
    $('#remove').classList.remove('remove');
    $('#rRight').classList.remove('rRight');
    $('#list').classList.remove('open');
}

export const setupNav = function() {
    const list = $('#list'), rLeft = $('#rLeft'), remove = $('#remove'), rRight = $('#rRight');
    $('#hamburger').onclick = () => {
        rLeft.classList.toggle('rLeft');
        remove.classList.toggle('remove');
        rRight.classList.toggle('rRight');
        list.classList.toggle('open');
    }
    $("#section").onclick = () => closeNav();

    const modalWrapper = $('#modal-wrapper');
    if(modalWrapper){
        $('#settingsBtn').onclick = () => modalWrapper.classList.remove('hidden');
        $('#closeBtn').onclick = () => {
            modalWrapper.classList.add('hidden');
            closeNav();
        }
        $('#submitBtn').onclick = () => {
            modalWrapper.classList.add('hidden');
            closeNav();
        }
    }
    else console.warn('no modal')
}


export const hexToHSL = function hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16);
        r /= 255, g /= 255, b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if(max == min){
        h = s = 0; // achromatic
    }else{
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    h = Math.round(360 * h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return {h, s, l};
}