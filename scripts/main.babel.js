/* WHAT THE APP DOES

   API-based app, that uses the iTunes API, by creating a lookup request to search for content in the stores based on iTunes IDs

   User will take the URL of any iOS or Mac app store and render its full resolution icon right in the browser.
 */

let Fetch = {
    $content: $('.content'),
    $form: $('form'),

    // show a “loading” state when a user submits the form
    toggleLoading: function(){
        // Toggle loading indicator
        this.$content.toggleClass('content--loading');

        // Toggle the submit button so we don't get double submissions
        // http://stackoverflow.com/questions/4702000/toggle-input-disabled-attribute-using-jquery
        this.$form.find('button').prop('disabled', function(i, v) { return !v; });
    },

    //creating 3 variables
    //user input
    userInput: '',
    //boolean which will be true or false
    //depending on whether the input from the user is valid
    userInputIsValid: false,
    //string of digits
    //will be extracted from userInput if it’s valid
    appId: '',

    //will validate the user’s input when called
    validate: function(input) {
        // validation happens here
        // Use regular expressions to test if input is valid. It's valid if:
        // 1. It begins with 'http://itunes'
        const regUrl = /^(http|https):\/\/itunes/;
        // 2. It has '/id' followed by digits in the string somewhere
        const regId = /\/id(\d+)/i;
        if ( regUrl.test(this.userInput) && regId.test(this.userInput) ) {
            this.userInputIsValid = true;
            //extract the ID from the URL and set it as appId
            let id = regId.exec(this.userInput);
            this.appId = id[1];
        } else {
            //set userInputIsValid to false
            //and the appId to an empty string
            this.userInputIsValid = false;
            this.appId = '';
        }
    },

    //creating error function
    throwError: function(header, text){
        this.$content
            //add header and text in the html
            //with the content-error class, so it can be styled
            .html('<p><strong>' + header + '</strong> ' + text + '</p>')
            .addClass('content--error');

        //run function to remove loading class
        //stops loading the gif
        this.toggleLoading();
    },

    //creating render function
    render: function(response) {
        //creats a HTMLImageElement
        let icon = new Image();
        //the browser will fetch the img of this specified URL
        icon.src = response.artworkUrl512;
        //when it's done fetching the img
        //starts this function
        icon.onload = function() {
            //execute toggleLoading
            Fetch.toggleLoading();
            //set the HTML $content to the retrieved img
            Fetch.$content
                .html(this)
                //grabs the trackName from the API responds and appends it
                //shows the app's name along with its icon
                .append('<p><strong>' + response.trackName + '</strong></p>')
                .removeClass('content--error');

            // If it's an iOS icon, load the mask too
            if(response.kind !== 'mac-software') {
                let mask = new Image();
                mask.src = 'img/icon-mask.png';
                mask.onload = function () {
                    Fetch.$content.prepend(this);
                }
            }
        }
    }
};

$(document).ready(function(){
    // On page load, execute this...
    Fetch.$form.on('submit', function(e){
        e.preventDefault(); //don't refresh the page

        // Do more stuff here...
        Fetch.toggleLoading(); // call the loading function

        //set to the value of the form's input field
        Fetch.userInput = $(this).find('input').val();
        //execute the validation function in Fetch.validate()
        Fetch.validate();
        if(Fetch.userInputIsValid) {
            //if input valid make API lookup request
            $.ajax({
                url: "https://itunes.apple.com/lookup?id=" + Fetch.appId,
                dataType: 'json'
            })
            .done(function(response2) {
                // when finished
                // Get the first response and log it
                let response = response2.results[0];
                console.log(response);

                // Check to see if request is valid & contains the info we want
                // If it does, render it. Otherwise throw an error
                if(response && response.artworkUrl512 !== null){
                    Fetch.render(response);
                } else {
                    Fetch.throwError(
                        'Invalid Response',
                        'The request you made appears to not have an associated icon. <br> Try a different URL.'
                    );
                }
                })
                .fail(function(data) {
                // when request fails
                Fetch.throwError(
                    'iTunes API Error',
                    'There was an error retrieving the info. Check the iTunes URL or try again later.');
            });
        } else {
            // else throw an error
            Fetch.throwError(
                'Invalid Link',
                'You must submit a standard iTunes store link with an ID, i.e. <br> <a href="https://itunes.apple.com/us/app/twitter/id333903271?mt=8">https://itunes.apple.com/us/app/twitter/<em>id333903271</em>?mt=8</a>'
            );
        }
    });
});
