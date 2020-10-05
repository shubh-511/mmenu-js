import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';
//	Add the options.
Mmenu.options.iconPanels = options;
export default function () {
    var _this = this;
    var options = extendShorthandOptions(this.opts.iconPanels);
    this.opts.iconPanels = extend(options, Mmenu.options.iconPanels);
    var keepFirst = false;
    if (options.visible == 'first') {
        keepFirst = true;
        options.visible = 1;
    }
    options.visible = Math.min(3, Math.max(1, options.visible));
    options.visible++;
    //	Add the iconpanels
    if (options.add) {
        this.bind('initMenu:after', function () {
            var _a;
            var classnames = ['mm-menu_iconpanel'];
            if (options.hideNavbar) {
                classnames.push('mm-menu_hidenavbar');
            }
            if (options.hideDivider) {
                classnames.push('mm-menu_hidedivider');
            }
            (_a = _this.node.menu.classList).add.apply(_a, classnames);
        });
        var classnames_1 = [];
        if (!keepFirst) {
            for (var i = 0; i <= options.visible; i++) {
                classnames_1.push('mm-panel_iconpanel-' + i);
            }
        }
        this.bind('openPanel:before', function (panel) {
            var panels = DOM.children(_this.node.pnls, '.mm-panel');
            panel = panel || panels[0];
            if (panel.parentElement.matches('.mm-listitem_vertical')) {
                return;
            }
            if (keepFirst) {
                panels.forEach(function (panel, p) {
                    panel.classList[p == 0 ? 'add' : 'remove']('mm-panel_iconpanel-first');
                });
            }
            else {
                //	Remove the "iconpanel" classnames from all panels.
                panels.forEach(function (panel) {
                    var _a;
                    (_a = panel.classList).remove.apply(_a, classnames_1);
                });
                //	Filter out panels that are not opened.
                panels = panels.filter(function (panel) {
                    return panel.matches('.mm-panel_opened-parent');
                });
                //	Add the current panel to the list.
                var panelAdded_1 = false;
                panels.forEach(function (elem) {
                    if (panel === elem) {
                        panelAdded_1 = true;
                    }
                });
                if (!panelAdded_1) {
                    panels.push(panel);
                }
                //	Remove the "hidden" classname from all opened panels.
                panels.forEach(function (panel) {
                    panel.classList.remove('mm-hidden');
                });
                //	Slice the opened panels to the max visible amount.
                panels = panels.slice(-options.visible);
                //	Add the "iconpanel" classnames.
                panels.forEach(function (panel, p) {
                    panel.classList.add('mm-panel_iconpanel-' + p);
                });
            }
        });
        this.bind('initPanel:after', function (panel) {
            if (options.blockPanel &&
                !panel.parentElement.matches('.mm-listitem_vertical') &&
                !DOM.children(panel, '.mm-panel__blocker')[0]) {
                var blocker = DOM.create('a.mm-panel__blocker');
                blocker.setAttribute('href', '#' + panel.closest('.mm-panel').id);
                panel.prepend(blocker);
            }
        });
    }
}
