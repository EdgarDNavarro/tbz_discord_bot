const fs = require('fs');
const { ytmp3 } = require('@vreden/youtube_scraper');
const { default: axios } = require('axios');

function getListIdFromUrl(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get("list");
}

const GetYoutubeMixData = async (url) => {
  var initdata = await {};
  var apiToken = await null;
  var context = await null;
  try {
    const page = await axios.get(encodeURI(url));
    const ytInitData = await page.data.split("var ytInitialData =");
    if (ytInitData && ytInitData.length > 1) {
      const data = await ytInitData[1].split("</script>")[0].slice(0, -1);

      if (page.data.split("innertubeApiKey").length > 0) {
        apiToken = await page.data
          .split("innertubeApiKey")[1]
          .trim()
          .split(",")[0]
          .split('"')[2];
      }

      if (page.data.split("INNERTUBE_CONTEXT").length > 0) {
        context = await JSON.parse(
          page.data.split("INNERTUBE_CONTEXT")[1].trim().slice(2, -2)
        );
      }

      initdata = await JSON.parse(data);
      
      return await Promise.resolve({ initdata, apiToken, context, mixItems: initdata?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents || [] });
    } else {
      console.error("cannot_get_init_data");
      return await Promise.reject("cannot_get_init_data");
    }
  } catch (ex) {
    console.error(ex);
    return await Promise.reject(ex);
  }
};

const downloadAudioFromYouTube = async (url, filePath) => {
    try {
            const quality = "128"
            const videoData = await ytmp3(url, quality)
            const downloadUrl = videoData.download.url;
        
            const response = await axios({
                url: downloadUrl,
                method: "GET",
                responseType: "stream",
            });
        
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
        
            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getListIdFromUrl,
    GetYoutubeMixData,
    downloadAudioFromYouTube
}