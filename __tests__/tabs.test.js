import { Tab, Tabs } from '../src';
import Vue from 'vue/dist/vue.js';

describe('vue-tabs-component', () => {
    Vue.component('tabs', Tabs);
    Vue.component('tab', Tab);

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="app">
                <tabs>
                    <tab name="First tab">
                        First tab content
                    </tab>
                    <tab name="Second tab">
                        Second tab content
                    </tab>
                    <tab name="Third tab">
                        Third tab content
                    </tab>
                </tabs>
            </div>
        `;

        const dateClass = Date;

        // eslint-disable-next-line no-global-assign
        Date = function (dateString) {
            return new dateClass(dateString || '2017-01-01T00:00:00.000Z');
        };

        window.location.hash = '';
    });

    it('can mount tabs', async () => {
        await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('displays the first tab by default', async () => {
        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('uses a custom fragment', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs cache-lifetime="10">
                    <tab id="my-fragment" name="First tab" >
                        First tab content
                    </tab>
                </tabs>
            </div>
        `;

        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#my-fragment');
    });

    it('uses the fragment of the url to determine which tab to open', async () => {
        window.location.hash = '#second-tab';

        const tabs = await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('ignores the fragment if it does not match the hash of a tab', async () => {
        window.location.hash = '#unknown-tab';

        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('can accept a prefix and a suffix for the name', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs cache-lifetime="10">
                    <tab name="First tab" prefix="prefix" suffix="suffix">
                        First tab content
                    </tab>
                </tabs>
            </div>
        `;

        await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });
});

async function createVm() {
    const vm = new Vue({
        el: '#app',
    });

    await Vue.nextTick();

    return vm.$children[0];
}

function progressTime(minutes) {
    const currentTime = (new Date()).getTime();

    const newTime = new Date(currentTime + (minutes * 60000));

    const originalDateClass = Date;

    // eslint-disable-next-line no-global-assign
    Date = function (dateString) {
        return new originalDateClass(dateString || newTime.toISOString());
    };
}
