export default class Source {
    constructor(opt) {
        Object.assign(this, opt);
    }

    source(sourceContent) {
        this.getCommentState(sourceContent);
        let reg = /([\s\S]*?)((NEJ\.define)|(define))/g;
        let matched;
        const startIndex = (() => {
            while (matched = reg.exec(sourceContent)) {
                if (this.notInComment(matched.index + matched[1].length, matched[2].length)) {
                    return matched.index + matched[1].length;
                }
            }
        })();

        const firstCode = sourceContent.substr(0, startIndex);
        const matchedStr = sourceContent.substr(startIndex);

        return {
            firstCode,
            matchedStr
        }
    }

    getCommentState(input) {
        let commentState = this.commentState = [];
        let matched;
        let reg = /(\/\/)|(\/\*)|(\*\/)/g;

        while (matched = reg.exec(input)) {

            if (matched[1]) {
                let idx = matched.index;
                while (input[++idx] && input[idx] !== '\n') {
                }
                commentState.push({
                    start: matched.index,
                    end: idx
                });
            } else if (matched[2]) {
                /**
                 *
                 * @type {number}
                 */
                try {
                    let closeCommentIdx = matched.index + /\*\//g.exec(input.substr(matched.index)).index;
                    commentState.push({
                        start: matched.index,
                        end: closeCommentIdx + 2
                    });
                } catch (err) {
                }
            }
        }
    }

    notInComment(idx, len) {
        return !this.commentState.some(item => {
            return (item.start < idx && item.end > idx + len);
        });
    }
};
