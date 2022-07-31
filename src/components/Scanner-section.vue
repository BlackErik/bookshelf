<template>
    <div class="scanner-container">
        <div v-show="!isLoading">
            <video  playsinline poster="data:image/gif,AAAA" ref="scanner"></video>
            <div class="overlay-element"></div>
            <div class="laser"></div>
        </div>
    </div>
</template>

<script>
import { BrowserMultiFormatReader, Exception } from "@zxing/library";
export default {
    name: "stream-barcode-reader",
    data() {
        return {
            isLoading: true,
            codeReader: new BrowserMultiFormatReader(),
            isMediaStreamAPISupported:
                navigator &&
                navigator.mediaDevices &&
                "enumerateDevices" in navigator.mediaDevices
        };
    },
    mounted() {
        //i deleted from here, so if broke refer to original file
        if (!this.isMediaStreamAPISupported) {
            throw new Exception("Media Stream API is not supported");
        }
        this.start();
        this.$refs.scanner.oncanplay = () => {
            this.isLoading = false;
            this.$emit("loaded");
        };
    },
    beforeUnmount() {
        this.codeReader.reset();
    },
    methods: {
        start() {
            this.codeReader.decodeFromVideoDevice(
                undefined,
                this.$refs.scanner,
                (result) => {
                    if (result) {
                        this.$emit("decode", result.text);
                    }
                }
            );
        }
    }
};
</script>

<style scoped>
video {
    width: inherit;
    height: inherit;
}
.scanner-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
}

.scanner-container div {
    width: 70vw;
    height: 70vh;
}

.overlay-element {
    position: absolute;
    top: 0;
    width: inherit;
    height: inherit;
    background: rgba(30, 30, 30, 0.5);
    -webkit-clip-path: polygon(
        0% 0%,
        0% 100%,
        20% 100%,
        20% 20%,
        80% 20%,
        80% 80%,
        20% 80%,
        20% 100%,
        100% 100%,
        100% 0%
    );
    clip-path: polygon(
        0% 0%,
        0% 100%,
        20% 100%,
        20% 20%,
        80% 20%,
        80% 80%,
        20% 80%,
        20% 100%,
        100% 100%,
        100% 0%
    );
}
.laser {
    width: 60%;
    background-color: tomato;
    height: 1px !important;
    position: absolute;
    top: 40%;
    z-index: 2;
    box-shadow: 0 0 4px red;
    -webkit-animation: scanning 2s infinite;
    animation: scanning 2s infinite;
}
@-webkit-keyframes scanning {
    40% {
        -webkit-transform: translateY(75px);
        transform: translateY(75px);
    }
}
@keyframes scanning {
    40% {
        -webkit-transform: translateY(75px);
        transform: translateY(75px);
    }
}
</style>