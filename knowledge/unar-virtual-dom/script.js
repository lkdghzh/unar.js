import {v} from './v.js';
import {diff }from './diff.js';
import {patch }from './patch.js';

let vnode = v(
    'div',
    {
        id: 1
    },
        v('input', {
            id: 1
        }),
        v('button', {
            id: 1
        },
            v('text'))
)
console.log(vnode)