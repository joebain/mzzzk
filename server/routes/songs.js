module.exports = {
	getSongs: function *(next) {
		this.data = [
			{title: "Billy Jean", artist: "Michael Jackson"},
			{title: "Thriller", artist: "Michael Jackson"}
		];
		yield next;
	},

	getSong: function *(next) {
		this.data = {title: "Billy Jean", artist: "Michael Jackson"};
		yield next;
	}
};
