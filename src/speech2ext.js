"use strict";

var speech2ext = {
    recognizing: false,
    /**
     * @type {webkitSpeechRecognition}
     **/
    recognition: null,
    init: function (
        /** @type {HTMLElement} */ selector,
        /** @type {{ setText: (arg0: string) => void; getAllText: () => any; }} */ editor
    ) {
        if (!('webkitSpeechRecognition' in window)) {
            console.log('Speech recognition not supported');
            selector.style.display = 'none';
            return;
        }

        var logo_mic = selector.querySelector('#logo-mic');

        /**
         * @type {HTMLTemplateElement | null}
         */
        var bi_mic_fill = selector.querySelector('#bi-mic-fill');

        logo_mic?.appendChild(bi_mic_fill?.content.cloneNode(true));

        selector.addEventListener('click', function () {
            console.log('CLICK');

            if (speech2ext.recognizing) {
                speech2ext.recognition?.stop();
                return;
            }

            speech2ext.recognition = new window.webkitSpeechRecognition();
            speech2ext.recognition.continuous = true;
            speech2ext.recognition.interimResults = true;

            let interim_transcript_el = document.querySelector('#interim_transcript');

            speech2ext.recognition.onresult = function (event) {
                speech2ext.recognizing = true;
                console.log('RESULT', event);
                var interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        editor.setText(
                            `${editor.getAllText()} ${event.results[i][0].transcript}`
                        );
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }

                if (interim_transcript_el) {
                    interim_transcript_el.innerHTML = interim_transcript;
                }
            };

            speech2ext.recognition.onend = function () {
                speech2ext.recognizing = false;

                selector.classList.remove('active');

                if (logo_mic) {
                    logo_mic.innerHTML = '';
                    logo_mic?.appendChild(selector.querySelector('#bi-mic-fill')?.content.cloneNode(true));
                }

                console.log('STOP');
            }

            if (speech2ext.recognition) {
                console.log('START');
                selector.classList.add('active');

                // ajouter un micro à l'élément logo_mic
                if (logo_mic) {
                    logo_mic.innerHTML = '';
                    logo_mic?.appendChild(selector.querySelector('#bi-mic-mute-fill')?.content.cloneNode(true));
                }

                speech2ext.recognition.start();
            }

            speech2ext.recognition.onerror = function (event) {
                console.error('speech2ext', event);
            }

        });

    },


}

export default speech2ext;