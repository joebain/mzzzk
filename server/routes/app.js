
module.exports = {
    home: function *(next) {
        this.data = {};
        yield next;
    }
};
