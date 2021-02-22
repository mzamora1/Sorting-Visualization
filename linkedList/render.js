import {$, create, sleep} from '../helpers.js';

export const createArrow = () => {
    const container = create('div', 'arrow');
    const rect = create('div', 'arrow-rect');
    const triangle = create('div', 'arrow-triangle');
    
    container.append(rect, triangle);
    return container;
}

export const createLink = (value) => {
    
    const copy = $(".link").cloneNode(true);
    copy.classList.remove('hidden');
    const span = copy.querySelector('.link-data');
    span.textContent = value;
    // const wrapper = $('.link-wrapper')
    // wrapper.insertBefore(copy, $(".null"));
    // $(".null").scrollIntoView();
    return copy;
}

export const addLast = (link) => {
    $(".null").before(link);
}

export const addBefore = (target, link) => {
    target.before(link);
}
export const addAfter = (target, link) => {
    target.after(link);
}

export const removeLink = async (link) => {
    link.replaceWith($(".null"));
    await sleep(1000);
    link.remove();
}

export const getList = () => {
    const links = $(".link-wrapper").querySelectorAll('.link:not(.link.hidden), .list-head');
    console.log(links);
    return links;
}

export const setActive = (link) => {
    link.classList.add('link-active');
}

export const removeActive = (link) => {
    link.classList.remove('link-active');
}

export const createList = () => {
    
}
// const container = create('div', 'link-wrapper');

// const link = createLink(111);
// container.appendChild(link);
// document.body.appendChild(link);