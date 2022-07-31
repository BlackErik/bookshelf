<template>
    <div class="socialMedia">
        <a href="#needalink" target="_blank" rel="noopener noreferrer" class="icon facebook">
            <div class="tooltip">Facebook</div>
            <span><i class="fab fa-facebook-f"></i></span>
        </a>
        <a href="#needalink" target="_blank" rel="noopener noreferrer" class="icon discord">
            <div class="tooltip">Discord</div>
            <span><i class="fab fa-discord"></i></span>
        </a>
        <a href="#needalink" target="_blank" rel="noopener noreferrer" class="icon instagram">
            <div class="tooltip">Instagram</div>
            <span><i class="fab fa-instagram"></i></span>
        </a>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="css" scoped >
* {
    margin: .5rem;
}

.socialMedia {
    grid-column: 1 / -1;
    grid-row: 4 / 5;
    margin-top: 2rem;
    justify-self: center;
    align-items: center;
}

.socialMedia .icon{
    position: relative;
    background-color: rgb(201, 201, 201);
    border-radius: 50%;
    margin: 10px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    display: inline-block;
    align-items: center;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    color: #333;
    text-decoration: none;
}

.socialMedia .tooltip {
    position: absolute;
    top: 0;
    line-height: 1.5;
    font-size: 14px;
    background-color: #ffffff;
    color: #ffffff;
    padding: 5px 8px;
    border-radius: 5px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.socialMedia .tooltip::before {
    position: absolute;
    content: "";
    height: 8px;
    width: 8px;
    background-color: #ffffff;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.socialMedia .icon:hover .tooltip {
    top: -45px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}
.socialMedia .icon:hover span,
.socialMedia .icon:hover .tooltip {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}
.socialMedia .facebook:hover,
.socialMedia .facebook:hover .tooltip,
.socialMedia .facebook:hover .tooltip::before {
    background-color: #3b5999;
    color: #ffffff;
}
.socialMedia .discord:hover,
.socialMedia .discord:hover .tooltip,
.socialMedia .discord:hover .tooltip::before {
    background-color: #7289da;
    color: #ffffff;
}
.socialMedia .instagram:hover,
.socialMedia .instagram:hover .tooltip,
.socialMedia .instagram:hover .tooltip::before {
    background-color: #e1306c;
    color: #ffffff;
}
.socialMedia .youtube:hover,
.socialMedia .youtube:hover .tooltip,
.socialMedia .youtube:hover .tooltip::before {
    background-color: #de463b;
    color: #ffffff;
}
</style>