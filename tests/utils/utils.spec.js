const {
  kFormatter,
  encodeHTML,
  FlexLayout,
  getCardColors,
} = require("../../src/utils");

describe("src/utils.js", () => {
  it("kFormatter should return formatted values", () => {
    expect(kFormatter(1)).toBe(1);
    expect(kFormatter(-1)).toBe(-1);
    expect(kFormatter(10000)).toBe("10k");
    expect(kFormatter(12345)).toBe("12.3k");
    expect(kFormatter(9900000)).toBe("9900k");
  });

  it("encodeHTML should encode passed HTML", () => {
    expect(encodeHTML(`<html>hello world<,.#4^&^@%!))`)).toBe(
      "&#60;html&#62;hello world&#60;,.#4^&#38;^@%!))"
    );
  });

  it("FlexLayout should set a flex layout for elements", () => {
    const layout = FlexLayout({
      items: ["<text>1</text>", "<text>2</text>"],
      gap: 60,
    }).join("");

    expect(layout).toBe(
      `<g transform=\"translate(0, 0)\"><text>1</text></g><g transform=\"translate(60, 0)\"><text>2</text></g>`
    );

    const columns = FlexLayout({
      items: ["<text>1</text>", "<text>2</text>"],
      gap: 60,
      direction: "column",
    }).join("");

    expect(columns).toBe(
      `<g transform=\"translate(0, 0)\"><text>1</text></g><g transform=\"translate(0, 60)\"><text>2</text></g>`
    );
  });

  it("getCardColors: should return expected values", () => {
    let colors = getCardColors({
      title_color: "f00",
      text_color: "0f0",
      icon_color: "00f",
      bg_color: "fff",
      theme: "dark",
    });
    expect(colors).toStrictEqual({
      titleColor: "#f00",
      textColor: "#0f0",
      iconColor: "#00f",
      bgColor: "#fff",
    });
  });

  it("getCardColors: should fallback to default colours if colours is invalid", () => {
    let colors = getCardColors({
      title_color: "invalidcolor",
      text_color: "0f0",
      icon_color: "00f",
      bg_color: "fff",
      theme: "dark",
    });
    expect(colors).toStrictEqual({
      titleColor: "#41419f",
      textColor: "#0f0",
      iconColor: "#00f",
      bgColor: "#fff",
    });
  });

  it("getCardColors: should fallback to specified theme colours if colours are not defined", () => {
    let colors = getCardColors({
      theme: "dark",
    });
    expect(colors).toStrictEqual({
      titleColor: "#fff",
      textColor: "#9f9f9f",
      iconColor: "#7b58cf",
      bgColor: "#1f1f1f",
    });
  });
});
