async function init() {
  try {
    const rustApp = await import("../pkg");

    let extension = "png";
    let imgBase64String = "";

    const fileReader = new FileReader();

    const uploadInput = document.getElementById("upload-input");
    const filterSelector = document.getElementById("select-filter");
    const blurInput = document.getElementById("filter-blur");

    let imageFilter = filterSelector.value;

    const handleBlurVisibility = (imgFilter) =>
      (blurInput.parentElement.style.visibility =
        imgFilter !== "blur" ? "hidden" : "visible");
    const setImageWithFilter = (imgFilter) => {
      if (rustApp.hasOwnProperty(imgFilter) && imgBase64String.length) {
        imgFilter = imgFilter;

        const filterFn = rustApp[imgFilter];
        const img_data_url =
          imgFilter !== "blur"
            ? filterFn(imgBase64String, extension)
            : filterFn(
                imgBase64String,
                extension,
                parseFloat(blurInput.value || 1)
              );

        document
          .getElementById("img-with-filter")
          .setAttribute("src", img_data_url);
      }
    };

    fileReader.onloadend = () => {
      extension = fileReader.result.match(/data:image\/(.*);base64/i)[1];
      imgBase64String = fileReader.result.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
      );

      handleBlurVisibility(imageFilter);
      setImageWithFilter(imageFilter);
    };

    uploadInput.addEventListener("change", () => {
      fileReader.readAsDataURL(uploadInput.files[0]);
    });

    filterSelector.addEventListener(
      "change",
      ({ target: { value: imgFilter } }) => {
        handleBlurVisibility(imgFilter);
        setImageWithFilter(imgFilter);
      }
    );
  } catch (err) {
    console.error(err);
  }
}

init();
