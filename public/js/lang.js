function setLang(lang) {
    document.cookie = 'lang=' + lang + '; path=/; max-age=31536000; SameSite=Lax';
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
}
