# Oddzielenie Oxford i EnglishFlow

Źródło: BartekStefen/oxford3000-nauka, commit 2c088150bdadf1dfbef14ab720e7a0caca4ccae8.

Oryginalny Oxford ma 3805 rekordów, 6 kolekcji, nagrania i sześć trybów nauki. Pozostaje w dotychczasowym repozytorium z niezmienionym kluczem slowka3000:v1. Nowa instrukcja użytkownika nakazuje oddzielną aplikację, dlatego nie przenosimy ani nie upraszczamy tego modułu. EnglishFlow odsyła do oryginału i zapisuje tylko ręcznie potwierdzony czas sesji.

Poprzedni EnglishFlow składał się z index.html i dwóch warstw nadpisujących globalne funkcje render/go. Plan miał częściowo stałe zadania, lokalne i chmurowe dane łączono bez pełnej ochrony konfliktów. Oxford osadzano w iframe. Publiczne parametry Supabase były puste.

Zachowano wszystkie 60 pozycji planu tygodniowego i 19 dodatkowych źródeł z unified.js. Rozróżniamy wyszukiwanie, stronę programu i bezpośredni materiał. Tytuły i adresy odziedziczone nie są przedstawiane jako ponownie zweryfikowane. Oryginalnego pliku „Mój angielski” nie udostępniono. Nie pobieramy ani nie publikujemy kopii Oxford/audio ani treści BBC. Brak pliku licencji nie daje podstawy do nadania odziedziczonej treści nowej otwartej licencji.

Zachowano 12 autorskich opisów gramatycznych z projektu i rozszerzono kurs. W nowej architekturze rozdzielono dane, widoki, planer i zapis IndexedDB. Szkice zapisują się podczas pisania, historia posiada UUID; import łączy historię bez duplikowania. Nie modyfikujemy dawnych danych localStorage.

Usunięcie englishflow/ w starym repo jest poprzedzone gałęzią backup/englishflow-before-split-2026-10-26. Pliki Oxford sprawdzane są po zmianie przez porównanie drzew Git z wyłączeniem englishflow/.
