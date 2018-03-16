<script>
import Vue from 'vue';
const autoHeight = {
    install(Vue, options) {
        let height, id = 0, listen = [];
        const countHeight = () =>{
            height = document.documentElement.clientHeight;
            listen.forEach((fn) =>{
                fn();
            });
        };
        const addEvent = (() =>{
            return document.addEventListener? (el, type, fn) =>{
                el.addEventListener(type, fn, false);
            }: (el, type, fn) =>{
                el.attachEvent('on' + type, function(){
                    return fn.call(el, window.event);
                });
            };
        })();
        addEvent(window, 'resize', () =>{
            countHeight();
        });
        countHeight();

        Vue.directive('autoHeight', {
            bind(el, binding, node){
                el._listen_id = id;
                el.className += ' auto-height';
                if(binding.value){
                    const value = binding.value;
                    if(value.scrollX || value.scroll){
                        el.style.overflowX = 'auto';
                    }
                    if(value.scrollY || value.scroll){
                        el.style.overflowY = 'auto';
                    }
                    listen[id] = () =>{
                        if(value.max){
                            el.style.maxHeight = height - el.offsetTop - 60 + (parseInt(value.offset, 10) || 0) + 'px';
                        }
                    };
                }else{
                    listen[id] = () =>{
                        el.style.height = height - el.offsetTop - 60 + (parseInt(binding.arg, 10) || 0) + 'px';
                    };
                }
                id++;
            },
            inserted(el){
                listen[el._listen_id]();
            },
            unbind(el){
                delete listen[el._listen_id];
            }
        });
    }
};

Vue.use(autoHeight);
</script>