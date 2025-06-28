let modalWrapper = document.querySelector(".modal-wrapper")
let modalInner = document.querySelector(".modal-inner")
let elList = document.querySelector(".list")
elList.innerHTML = "Loading..."

const api = "https://fakestoreapi.com/products/"
const TOKEN = "8031338794:AAH6s-zPLGje-hyrBy25Kj5lgKWwWK_RKkU"
const CHAT_ID = "-1002475444560"
// const API_Message = `https://api.telegram.org/bot${TOKEN}/sendMessage`
const API_Message = `https://api.telegram.org/bot${TOKEN}/sendPhoto`

let elSearchInput = document.querySelector(".search-input");
let allProducts = [];

// get products 
function getProducts() {
    axios(api).then(res => {
        allProducts = res.data;
        renderProducts(allProducts, elList);
    });
}
getProducts();

elSearchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();
    
    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(value) ||
        String(product.price).includes(value)
    );
    renderProducts(filtered, elList);
});

// render products 
function renderProducts(arr, list) {
    list.innerHTML = null
    arr.forEach(item => {
        let elItem = document.createElement("li")
        elItem.classList = "w-[300px] rounded-md overflow-hidden p-3 shadow-md bg-white"
        elItem.innerHTML = `
            <img class="h-[250px] mx-auto mb-3 " src="${item.image}" alt="product img"/>
            <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${item.title}</h2>
            <p class="font-semibold text-[15px] line-clamp-3 mb-2">${item.description}</p>
            <strong class="text-[20px] mb-3 inline-block">${item.price}$</strong>
            <button onclick="handleOrder(${item.id})" class="w-full class-bg py-2 cursor-pointer hover:scale-[1.05] duration-300 rounded-md font-semibold text-white">Order</button>
        `
        list.append(elItem)
    })
}
// remder products 

// order part 
function handleOrder(id) {
    modalWrapper.classList.remove("scale-0")
    modalInner.innerHTML = "Loading.."
    axios(`${api}/${id}`).then(res => {
        modalInner.innerHTML = `
        <div class="sm:flex gap-[30px] ">
            <img class="w-[250px] h-[300px] mx-auto sm:w-[300px] sm:h-[400px] mb-3 sm:mb-0" src="${res.data.image}" alt="img" width="200" height="300"/>
            <div class="w-[300px]">
                <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${res.data.title}</h2>
                <p class="font-semiboldtext-[15px] line-clamp-3 mb-2">${res.data.description}</p>
                <strong class="text-[20px] mb-2 sm:mb-3 inline-block">${res.data.price} $</strong>
                <form class="order-form space-y-2 sm:space-y-3" autocomplete="off">
                    <input required type="text" class="p-2 rounded-md font-semibold w-full outline-none shadow-md border-[1px]" placeholder="Enter Name" name="name"/>
                    <input required type="tel" class="p-2 rounded-md font-semibold w-full outline-none shadow-md border-[1px]" placeholder="Enter Phone number" name="phone"/>
                    <input required type="text" class="p-2 rounded-md font-semibold w-full outline-none shadow-md border-[1px]" placeholder="Enter Address" name="address"/>
                    <button type="submit" class="w-full py-2 cursor-pointer hover:scale-[1.05] duration-300 rounded-md class-bg font-semibold text-white">Order</button>
                </form>
            </div>
        </div>
    `
        let elOrderForm = document.querySelector(".order-form")
        elOrderForm.addEventListener("submit", function (e) {
            e.preventDefault()
            let message = `<b>Title: ${res.data.title}</b> \n`
            message += `<b>Description: ${res.data.description}</b> \n`
            message += `<b>Price: ${res.data.price}$</b> \n`
            message += `-------------------------------------------- \n`
            message += `<b>Name: ${e.target.name.value}</b> \n`
            message += `<b>Phone Number: ${e.target.phone.value}</b> \n`
            message += `<b>Addres: ${e.target.address.value}</b> \n`
            // const data = { massage uchun
            //     parse_mode:"html",
            //     text: message,
            //     chat_id: CHAT_ID
            // }
            const data = {
                parse_mode: "html",
                chat_id: CHAT_ID,
                photo: res.data.image,
                caption: message
            }
            axios.post(API_Message, data).then(() => modalWrapper.classList.add("scale-0"))
        })
    })
}
// order part 
modalWrapper.addEventListener("click", (e) => e.target.id == "wrapper" ? modalWrapper.classList.add("scale-0") : "")
