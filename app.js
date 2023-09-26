
const colorForm = document.getElementById("color-form")
const cardContainer = document.querySelector(".card-container")
const colorImage = document.getElementById("color-image")
const colorRectangles = document.getElementById("color-rectangles")



colorForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const color = document.getElementById("color-picker").value.slice(1)
    const selectedSchema = document.getElementById("color-schema").value.toLowerCase()

    fetch(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${selectedSchema}&count=5`)
    .then(res => res.json())
    .then(data => {
        const colorCodesPlain = data.colors.map(color => color.hex.value.slice(1));
        const colorsCodesComplete = data.colors.map(color => color.hex.value);

        // Fetches the image URLs
        const fetchImagePromises = colorCodesPlain.map(hexCode =>
            fetch(`https://www.thecolorapi.com/id?hex=${hexCode}`)
                .then(res => res.json())
                .then(data => data.image.bare)
        );

        Promise.all(fetchImagePromises)
            .then(imageUrls => {
                let html = ""
                for (let i = 0; i < 5; i++) {
                    html += `
                    <div class="column">
                        <img data-hex="${colorsCodesComplete[i]}" class="rectangle" src="${imageUrls[i]}" alt="color">
                        <p class="hex-code">${colorsCodesComplete[i]}</p>
                    </div>
                    `
                }
                colorRectangles.innerHTML = html

                const colorImgHex = document.querySelectorAll(".rectangle")
                const hexCodes = document.querySelectorAll(".hex-code")

                colorImgHex.forEach(function(image) {
                    image.addEventListener("click", () => {
                        navigator.clipboard.writeText(image.dataset.hex)
                        copyToClipboardMessage(image.dataset.hex)
                    })
                })

                hexCodes.forEach(function(code) {
                    code.addEventListener("click", () => {
                        navigator.clipboard.writeText(code.textContent)
                        copyToClipboardMessage(code.textContent)
                    })
                })
                
            })
            .catch(error => {
                console.error("Error fetching image URLs:", error);
            });
    });
    

}) 
// End of Form Submit

function copyToClipboardMessage(text) {
    const message = document.createElement("div")
    message.innerText = `Copied ${text} to clipboard`
    message.classList.add("copy-message")
    document.body.appendChild(message)
    setTimeout(() => {
      message.remove()
    }, 2000)
  }

