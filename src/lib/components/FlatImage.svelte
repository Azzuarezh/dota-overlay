<script>
    import tinycolor from "tinycolor2";
    import { onMount } from "svelte";
    let imgHeight = $state();
    let imgWidth = $state();
    let color_hex = $state('#FFFFFF')
    let img;
    let canvas;
    let context;
    let {alt_text,image_path, css_class} =$props()
    let flatImageUrl = $state(image_path)
    onMount(() => {
		context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		// this will re-run whenever `color` change
		canvas.setAttribute("width", img.width);
        canvas.setAttribute("height", img.height);
        
        context.drawImage(img, 0, 0);
        var dataObject = context.getImageData(0, 0, img.width, img.height);
        var data = dataObject.data;
        for (var i = 0; i < data.length; i += 4) {
            var r = data[i],
                g = data[i + 1],
                b = data[i + 2],
                a = data[i + 3];
            var notTransparent = a != 0;
            var nonBackground = ( notTransparent && r != 255 && g != 255 && b != 255 );
            if ( nonBackground ) {
                var input = tinycolor(color_hex);
                var rgb = input.toRgb();
                data[i] = rgb.r;
                data[i + 1] = rgb.g;
                data[i + 2] = rgb.b;
                data[i + 3] = a;
            }
        }
        context.putImageData(dataObject, 0, 0);
        img.src = canvas.toDataURL();
        flatImageUrl = canvas.toDataURL()
	});
</script>
<svelte:document/>
<div class="hidden">
    <img bind:this={img} src={image_path} alt={alt_text} bind:clientWidth={imgWidth} bind:clientHeight={imgHeight} />  <!-- doksli (colored)-->
    <canvas bind:this={canvas}></canvas>
</div>
<img class={css_class} src={flatImageUrl} alt={alt_text}/>