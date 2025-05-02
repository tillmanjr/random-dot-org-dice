const DiscardItem = 'DiscardItem'
const ReplaceWithItem = 'ReplaceWithItem'

const OverfillRules = [DiscardItem, ReplaceWithItem]

const createDiscardItemRule = () => DiscardItem
const createReplaceWithItemRule = () => ReplaceWithItem

const isValidOverfillRule = (rule) => OverfillRules.includes(rule)
const isDiscardItemRule = (rule) => rule === DiscardItem
const isReplaceWithItemRule = (rule) => rule === ReplaceWithItem

module.exports = {
    createDiscardItemRule,
    createReplaceWithItemRule,
    isDiscardItemRule,
    isReplaceWithItemRule,
    isValidOverfillRule
}