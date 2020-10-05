import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';

//	Add the options.
Mmenu.options.setSelected = options;

export default function (this: Mmenu) {
    var options = extendShorthandOptions(this.opts.setSelected);
    this.opts.setSelected = extend(options, Mmenu.options.setSelected);

    //	Find current by URL
    if (options.current == 'detect') {
        const findCurrent = (url: string) => {
            url = url.split('?')[0].split('#')[0];
            const anchor = this.node.menu.querySelector(
                'a[href="' + url + '"], a[href="' + url + '/"]'
            );
            if (anchor) {
                this.setSelected(anchor.parentElement);
            } else {
                const arr = url.split('/').slice(0, -1);
                if (arr.length) {
                    findCurrent(arr.join('/'));
                }
            }
        };

        this.bind('initMenu:after', () => {
            findCurrent.call(this, window.location.href);
        });

        //	Remove current selected item
    } else if (!options.current) {
        this.bind('initListview:after', (listview: HTMLElement) => {
            DOM.children(listview, '.mm-listitem_selected').forEach(
                (listitem) => {
                    listitem.classList.remove('mm-listitem_selected');
                }
            );
        });
    }

    //	Add :hover effect on items
    if (options.hover) {
        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu_selected-hover');
        });
    }

    //	Set parent item selected for submenus
    if (options.parent) {
        this.bind('openPanel:after', (panel: HTMLElement) => {
            //	Remove all
            DOM.find(this.node.pnls, '.mm-listitem_selected-parent').forEach(
                (listitem) => {
                    listitem.classList.remove('mm-listitem_selected-parent');
                }
            );

            //	Move up the DOM tree
            let parent: HTMLElement = DOM.find(this.node.menu, `#${panel.dataset.mmParent}`)[0];
            while (parent) {
                if (!parent.matches('.mm-listitem_vertical')) {
                    parent.classList.add('mm-listitem_selected-parent');
                }

                parent = parent.closest('.mm-panel') as HTMLElement;
                parent = DOM.find(this.node.menu, `#${parent.dataset.mmParent}`)[0];
            }
        });

        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu_selected-parent');
        });
    }
}
