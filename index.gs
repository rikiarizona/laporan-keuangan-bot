//CONFIG
var BOT_TOKEN = "5567019114:AAFhBIqt5f_k4THSg28RXlNCcrQ6X87p_4s" //BOT TOKEN ANDA
var SS_URL = "https://docs.google.com/spreadsheets/d/1_4T69zig4iaPRdf2Y6czA_Ch1iC7qfjgRVD8D0kOqXQ/edit#gid=0" //URL SPREADSHEET
var SHEET_NAME = "HOME ACCOUNT" //NAMA SHEET
var USERS = [
	357286323
] //CHAT ID, bisa lebih dari 1


//BEGIN
var SHEET = SpreadsheetApp.openByUrl(SS_URL).getSheetByName(SHEET_NAME);

function doGet(e) {
	return HtmlService.createHtmlOutput('<h1>OK</h1>')
}

function doPost(e) {
	if (e.postData.type == "application/json") {
		let update = JSON.parse(e.postData.contents);
		if (update) {
			commands(update)
			return true
		}
	}
}

function commands(update) {

	let chatId = update.message.chat.id;
	let first_name = update.message.chat.first_name;
	let text = update.message.text || '';
	let tanggal = new Date().toLocaleString();

	if (USERS.includes(chatId)) {

		if (text.startsWith("/start")) {
			sendMessage({
				chat_id: chatId,
				text: "Mulai laporan dengan cara \n/new [harga] [#kategori] [item1, item2 dst]"
			})
		} else if (text.startsWith("/new")) {
			let item,
				harga,
				kategori,
				stext = text.split(' ')

			harga = eval(stext[1]);
			kategori = stext[2].startsWith('#') ? stext[2].replace('#', '') : '';
			stext.splice(0, 3);
			item = stext.join(' ')


			if (harga && kategori && item) {
				insert_value([
					tanggal,
					kategori,
					item,
					harga,
					chatId,
					first_name
				], SHEET)

				sendMessage({
					chat_id: chatId,
					text: 'Laporan sukses.'
				})

			} else {
				sendMessage({
					chat_id: chatId,
					text: 'Gagal. Pastikan sesuai format. \n/new [harga] [#kategori] [item1, item2 dst]'
				})
			}
		}
	}
}

function sendMessage(postdata) {
	var options = {
		'method': 'post',
		'contentType': 'application/json',
		'payload': JSON.stringify(postdata),
		'muteHttpExceptions': true
	};
	UrlFetchApp.fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', options);
}
