document.addEventListener('alpine:init', () => {
    Alpine.directive('amountity', (el, { value, modifiers, expression }, { Alpine, effect, cleanup, evaluate, evaluateLater }) => {
        const amountEffect = evaluateLater(expression)
        effect(()=>{
                amountEffect((...amount) => {
                    el.value = (amount || 0).toString().replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
            })
        })
        const amount = evaluate(expression)
        el.value = (amount || 0).toString().replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
        function keyup(e){
            if(e.type == 'paste'){
                const paste  = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('text')
                let _start = e.target.selectionStart
                let _end = e.target.selectionEnd
                const val = el.value
                el.value = `${val.substring(0, _start)}${paste}${val.substring(_end)}`
                el.setSelectionRange(_start + paste.length, _start + paste.length)
                e.preventDefault();
                e.stopPropagation();
            }
            if(el.value == '0'){
                evaluate(`${expression} = 0`)
                return
            }
            const _value = el.value
            if(!el.value) {
                el.value = '0'
                el.setSelectionRange(0, 1)
            }
            let value = ''
            let start = e.target.selectionStart;
            let end = e.target.selectionStart;
            el.value.split('').forEach(function(char, i){
                if(!(/\d/.test(char))){
                    start = start > i ? Math.max(0, start -1) : start
                    end = end > i ? Math.max(0, end -1) : end
                    return
                }
                value = `${value}${char}`
            })
            evaluate(`${expression} = ${value|| 0}`)
            let length = value.length
            el.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
            if(_value != el.value){
                const ov = length%3
                const additionalStart = start <= ov? start : start + Math.floor((start-1) / 3)
                const additionalEnd = end <= ov? end : end + Math.floor((end-1) / 3)
                el.setSelectionRange(additionalStart, additionalEnd)
            }
        }
        function keydown(e){
            let start = e.target.selectionStart;
            let end = e.target.selectionStart;
            const match = this.value.match(/^0+/)
            if(match){
                const length = match[0].length
                this.setSelectionRange(Math.max(0, start -length), Math.max(end+length))
            }
        }
        function focus(e){
            if(el.value === ''){
                el.value = '0'
            }
            if(el.value === '0'){
                el.setSelectionRange(0, 1)
            }
        }
        el.addEventListener('keydown', keydown)
        el.addEventListener('keyup', keyup)
        el.addEventListener('paste', keyup)
        el.addEventListener('focus', focus)
    })
})
