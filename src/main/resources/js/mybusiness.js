function getLlisoftText(langKey) {
	return llisoft[llisoftLang][langKey];
}
function switchLanguage(language) {
	if (window.location.href.indexOf(".html") == -1) {
		window.open("changelanguage.html?language=" + language + "&originalUrl="
				+ encodeURI(window.location.href), "_self");
	} else {
		if (window.location.href.indexOf(".html?") == -1) {
			window.open("?language=" + language, "_self");
		} else {
			window.open("&language=" + language, "_self");
		}
	}
}