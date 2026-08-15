// source: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function sfc32(a, b, c, d) {
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
}
}


function shuffle(array, getRand) {
    for (let i = array.length-1; i != 0; i--) {
        let randomIndex = Math.floor(getRand() * (i+1));
        
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
}

function bingo() {
    alert("Shout 'Bingo!' loudly as fast as possible!\n\nThe first person to shout 'Bingo!' in the ceremony hall will receive a pack of stroopwafels. Message us on Discord (IOI server, or privately to any member of the Dutch delegation) to claim your prize.")
}

let cells = new Array(25);

function handleClick() {
    $(this).toggleClass("cliked");
    let id = this.id.slice(1);
    cells[id] = 1 - cells[id];

    let tC = id%5, tR = (id-tC)/5;
    let b3 = tC == tR, b4 = tC == 4-tR; 

    for(let r = 0; r < 5; r++) {
        let b = tR == r, b2 = tC == r;
        if(!cells[r*5+r])
            b3 = false;
        if(!cells[r*5-r+4])
            b4 = false;
        for(let c = 0; c < 5; c++) { // :O c++ reference????
            if(!cells[r*5+c])
                b = false;
            if(!cells[c*5+r])
                b2 = false;
        }
        if(b || b2) {
            bingo();
            return;
        }
    }
    if(b3 || b4)
        bingo();
}

$(function() {
    for(let i=0;i<25;++i) cells[i]=false;
    let countrycode = prompt("enter country code");
    let seed = cyrb128(countrycode.toUpperCase());
    let getRand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    $.getJSON("bingo.json", function(data) {
        celltexts = data.random;
        shuffle(celltexts, getRand);
        celltexts.splice(12,0, data.free[Math.floor(getRand() * data.free.length)] + " (free space)");
        
        $("#bingogobrrrr > div").each(function(id,el) {
            $(this).text(celltexts[id]);
        });
        
        $("#bingogobrrrr > div").on("click", handleClick);
        
    });
});

