const jsContainer = document.querySelector("#js")
const reactContainer = document.querySelector("#react")

const render = () => {
    jsContainer.innerHTML = `
    <div class='div'>
    jsdom:
    <input />
    <span>${new Date().getSeconds()}s</span>
    </div>
`
    ReactDOM.render(
        React.createElement(
            'div',
            { className: 'div' },
            'Reactdom:',
            React.createElement('input'),
            React.createElement('span', null, new Date().getSeconds()+'s')
        ),
        reactContainer
    )
}
setInterval(render,1000)
