import Bind from './bind'
import On from './on'
import Model from './model'
import If from './if'
import For from './for'
import Text from './text'
import Html from './html'
import Show from './show'
function directiveFactory(opts) {
    var instance
    if (opts.prefix == ':') {
        instance = new Bind(opts)
    } else if (opts.prefix == '@') {
        instance = new On(opts)
    } else {
        switch (opts.directive) {
            case 'model':
                instance = new Model(opts)
                break
            case 'if':
                instance = new If(opts)
                break
            case 'for':
                instance = new For(opts)
                break
            case 'text':
                instance = new Text(opts)
                break
            case 'html':
                instance = new Html(opts)
                break
            case 'show':
                instance = new Show(opts)
                break
            default:
                break
        }
    }
    return instance
}

export default directiveFactory