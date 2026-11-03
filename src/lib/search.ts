// Turkish-aware matching: "sarj" finds "Şarjlı", "isik" finds "Işık". NFD strips the cedilla/breve/umlaut
// marks; dotless ı has no decomposition, so it is folded by hand.
export function fold(text: string) {
  return text
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i");
}

export const queryWords = (query: string) => fold(query).split(/\s+/).filter(Boolean);

// Every word has to appear somewhere in the haystack, in any order.
export const matches = (haystack: string, words: string[]) => words.every((w) => haystack.includes(w));

export const haystack = (...parts: (string | undefined)[]) => fold(parts.filter(Boolean).join(" "));
