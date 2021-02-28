class OpenAddressTable {
    #m1;
    #m2;
    #dict = []
    constructor(m1, m2) {
        this.#m1 = m1;
        this.#m2 = m2;
    }
    #generateKey(word) {
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = (hash * 128) % this.#m1;
            hash = (hash + word.charCodeAt(i)) % this.#m1;
        }
        return hash;
    }
    addWord(word) { //returns the slot where the word was inserted
        const key = this.#generateKey(word);
        let slot = key;
        while (this.#dict[slot]) {
            slot = (key + slot * (key % this.#m2)) % this.#m1;
        }
        this.#dict[slot] = word;
        return slot;
    }
    searchWord(word) { //returns the slot if found else -1
        const key = this.#generateKey(word)
        let slot = key;
        while (this.#dict[slot]) {
            if (this.#dict[slot] == word) {
                return slot;
            }
            slot = (key + slot * (key % this.#m2)) % this.#m1;
        }
        return -1;
    }
}

const hash_table = new OpenAddressTable(50021, 49919);
const CLOSED_ADDRESS_TABLE_M1 = 10007;
const PRIME = 100000007;
let collisions = 0;
const A = getRandomA(), B = getRandomB(); //randomly generated
const D = 128;
const a = [], b = [], M = [];
const dict = [];
function getRandomB() {
    return Math.floor(Math.random() * PRIME);
}
function getRandomA() {
    return getRandomB() + 1; //must be greater than 0
}
function getSlot(key, a, b, m) {
    return (((key * a) % PRIME + b) % PRIME) % m;
}
function resolveCollision(slot) {
    let resolved = false;
    let tempArray = [];
    for (let index = 0; index < dict[slot].length; index++) {
        //collect the data
        tempArray.push(dict[slot][index]);
    }
    while (!resolved) {
        a[slot] = getRandomA();
        b[slot] = getRandomB();
        dict[slot] = [];  //clearing the previous list
        for (let index = 0; index < tempArray.length; index++) {
            h2 = getSlot(data[index].key, a[slot], b[slot], (M[slot] * M[slot]));//m` = m^2 
            if (dict[slot][h2]) {
                collisions += 1;
                break;
            } else {
                dict[slot][h2] = tempArray[index];
            }
            if (index == tempArray.length - 1) {
                //processed all the keys successfully
                resolved = true;
            }
        }
    }
}

for (let i = 0; i < CLOSED_ADDRESS_TABLE_M1; i++) {
    dict[i] = [];
    a[i] = 0;
    b[i] = 0;
    M[i] = 0; // initial size of ith hashValue array = 0
}
//find the size of each row in second hash table
let sampEnglish = 0 ;
let sampBangla = 0;
(function(){
    sampEnglish = data1;
    sampBangla = data2;
   console.log(data1) ;
})();

for (let i = 0; i < sampEnglish.length; i++) {
    const key = hash_table.addWord(sampEnglish[i]) //getting the key from open address table
    const slot = getSlot(key, A, B, CLOSED_ADDRESS_TABLE_M1);
    M[slot] += 1;
    dict[slot].push({ 'key': key, 'bn': sampBangla[i]});//initally add the key and data next to each other
}
let total = 0; // no of secondary arrays
for (let i = 0; i < M.length; i++) {
    if (M[i] > 1) {//check for collisions only when more than one element
        resolveCollision(i);
        total += 1;
    }
}

let input = document.querySelector('#input');
let search_Button = document.querySelector('#search_button');
search_Button.addEventListener('click', function (e) {
    e.preventDefault();

    //get input
    let word = input.value;
    if (word === '') {
        alert("Insert a word");
    }

    word = word.toLowerCase();
    let slot = hash_table.searchWord(word);
    if (slot === -1) {
        alert("No such word found");
    }
    else {
        const h1 = getSlot(slot, A, B, CLOSED_ADDRESS_TABLE_M1);
        const h2 = getSlot(slot, a[h1], b[h1], M[h1] * M[h1]);
        if (dict[h1][h2]) {
            console.log(dict[h1][h2].bn);
            document.getElementById("selected_word").innerHTML = word ;
            document.getElementById("definition").innerHTML = dict[h1][h2].bn ;
        }
        else {
            alert("word does not exist");
        }
    }
})
