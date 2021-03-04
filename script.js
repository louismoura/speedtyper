// script gets called after document has loaded
$(function() {
    let timeLimit = 20 // change this variable to change difficulty
    let secondsRemaining = timeLimit
    $(".time-limit").text(timeLimit)
    $("#time-left").text(timeLimit)
    let score = 0

    function getRandomQuote() {
        return fetch("http://api.quotable.io/random")
            .then(response => response.json())
            .then(data => data.content)
    }

    async function getNextQuote() {
        const quote = await getRandomQuote()
        $("#phrase").html(null)
        // refactor below to jquery
        quote.split("").forEach(character => {
            const characterSpan = document.createElement("span")
            $(characterSpan).text(character)
            $("#phrase").append(characterSpan)
        })
        $("#input").val(null)
        $("#score").text(score)
    }

    function countdown() {
        if (secondsRemaining > 0) {
            secondsRemaining--
        } else {
            $("#message").text("Game Over!")
        }
        $("#time-left").text(secondsRemaining)
    }

    getNextQuote()
    setInterval(countdown, 1000)

    $("#input").on("input", function() {
        let typedCorrect = true
        $("#phrase span").each(function(index) {
            const character = $("#input").val().split("")[index]
            if (character == null) {
                $(this).removeClass("text-danger")
                $(this).removeClass("text-success")
                typedCorrect = false
            } else if (character === $(this).text()) {
                $(this).addClass("text-success")
                $(this).removeClass("text-danger")
            } else {
                $(this).addClass("text-danger")
                $(this).removeClass("text-success")
                typedCorrect = false
            }
        })
        if (typedCorrect && secondsRemaining > 0) {
            secondsRemaining = timeLimit + 1
            score++
            getNextQuote()
        }
    })

    $("#new-game").click(function() {
        secondsRemaining = timeLimit + 1
        score = 0
        getNextQuote()
        $("#input").focus()
        $("#message").text(null)
    })
})