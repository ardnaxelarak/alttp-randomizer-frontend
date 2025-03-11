import center from "center-align";

export default class ZSPR {
  constructor(buffer) {
    this.patch = buffer;
    const dec = new TextDecoder("utf-8");
    const header = dec.decode(buffer.subarray(0, 4));
    this.valid = (header == 'ZSPR');
    if (this.valid) {
      this._parse();
    }
  }

  _parse() {
    this.gfxOffset = ((this.patch[12] << 24) | (this.patch[11] << 16) | (this.patch[10] << 8) | this.patch[9]) >>> 0;
    this.palOffset = ((this.patch[18] << 24) | (this.patch[17] << 16) | (this.patch[16] << 8) | this.patch[15]) >>> 0;
    const metadataOffset = 0x1D;
    const dec8 = new TextDecoder("utf-8");
    const dec16 = new TextDecoder("utf-16");

    var start = metadataOffset;
    var index = start;
    while (index < this.gfxOffset) {
      if (this.patch[index] == 0 && this.patch[index + 1] == 0) {
        this.spriteName = dec16.decode(this.patch.subarray(start, index));
        break;
      }
      index += 2;
    }
    index += 2;

    start = index;
    while (index < this.gfxOffset) {
      if (this.patch[index] == 0 && this.patch[index + 1] == 0) {
        this.spriteAuthor = dec16.decode(this.patch.subarray(start, index));
        break;
      }
      index += 2;
    }
    index += 2;

    start = index;
    while (index < this.gfxOffset) {
      if (this.patch[index] == 0) {
        this.spriteAuthorShort = dec8.decode(this.patch.subarray(start, index));
        break;
      }
      index += 1;
    }
  }

  apply(rom) {
    if (!this.valid) {
      throw "Invalid Patch";
    }

    if (this.gfxOffset != 0xFFFFFFFF) {
      rom.set(this.patch.subarray(this.gfxOffset, this.gfxOffset + 0x7000), 0x080000);
    }

    rom.set(this.patch.subarray(this.palOffset, this.palOffset + 120), 0x0DD308);
    rom.set(this.patch.subarray(this.palOffset + 120, this.palOffset + 124), 0x0DEDF5);

    if (rom[0x118000] === 0x02 && rom[0x118001] === 0x37
        && rom[0x11801E] === 0x02 && rom[0x11801F] === 0x37) {
      var author = center(this.spriteAuthorShort.substring(0, 28), 28);
      if (author.length == 27) {
        author += " ";
      }

      const [tophalf, bottomhalf] = format_author(author);

      rom.set(tophalf, 0x118002);
      rom.set(bottomhalf, 0x118020);
    }

    return rom;
  }
}

function format_author(name) {
  const tophalf = [];
  const bothalf = [];

  for (var chr of name.split("")) {
    if (chr >= "0" && chr <= "9") {
      tophalf.push(chr.charCodeAt(0) - "0".charCodeAt(0) + 0x53);
      bothalf.push(chr.charCodeAt(0) - "0".charCodeAt(0) + 0x79);
    } else if (chr >= "A" && chr <= "Z") {
      tophalf.push(chr.charCodeAt(0) - "A".charCodeAt(0) + 0x5D);
      bothalf.push(chr.charCodeAt(0) - "A".charCodeAt(0) + 0x83);
    } else if (chr >= "a" && chr <= "z") {
      tophalf.push(chr.charCodeAt(0) - "a".charCodeAt(0) + 0x5D);
      bothalf.push(chr.charCodeAt(0) - "a".charCodeAt(0) + 0x83);
    } else if (chr == "'") {
      tophalf.push(0x77);
      bothalf.push(0x9D);
    } else if (chr == ".") {
      tophalf.push(0xA0);
      bothalf.push(0xC0);
    } else if (chr == "/") {
      tophalf.push(0xA2);
      bothalf.push(0xC2);
    } else if (chr == ":") {
      tophalf.push(0xA3);
      bothalf.push(0xC3);
    } else if (chr == "_") {
      tophalf.push(0xA6);
      bothalf.push(0xC6);
    } else {
      tophalf.push(0x9F);
      bothalf.push(0x9F);
    }
  }

  return [new Uint8Array(tophalf), new Uint8Array(bothalf)];
}
