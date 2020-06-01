import axios from 'axios'
import { sleep } from '../tools/tools'

function search(wordsearch, instance, type,source,step, offset = 0, limit = 100, result = {
    "count" : 0,
    "recordings" : []
}){
    if(step%100 === 0){
        limit = 100
    }else if(step%50 === 0){
        limit = 50
    }else if(step%25 === 0){
        limit = 25
    }else{
        limit = 100
        
    }
    if(type !== "All"){
        return instance.get(`recording?query=${type}:"${wordsearch}"&offset=${offset}&limit=${limit}`, {
            cancelToken: source.token
          }).then(
            function (response) {
                if(response.status === 200 && response.data){
                    offset = offset + limit
                    for (const recording of response.data.recordings) {
                            result["recordings"].push(recording)
                    }
                    if(!step){step = response.data.count}
                    if(response.data.count > offset && (offset%step) !== 0 ){
                        sleep(600)
                        // Vive la récursivité =|
                        return search(wordsearch, instance, type, source,step, offset,  limit, result)
                        
                    }else{
                        result["count"] = response.data.count
                        return result
                    }

                    
                }


            }
        ).catch(function(thrown) {
            if (axios.isCancel(thrown)) {
                let data = {
                    'cancel' : true
                }
                console.log('Request canceled', thrown.message);
                return data 
            }
          });
    }else{
        return instance.get(`recording?query=artist:"${wordsearch}"%20OR%20release:"${wordsearch}"%20OR%20recording:"${wordsearch}"&offset=${offset}&limit=${limit}`, {
            cancelToken: source.token
          }).then(
            function (response) {

                if(response.status === 200 && response.data){
                    offset = parseInt(offset) + limit
                    for (const recording of response.data.recordings) {
                        result["recordings"].push(recording)
                    }
                    if(!step){step = response.data.count}
                if(response.data.count > offset  && (offset%step) !== 0){
                    sleep(600)
                    // Vive la récursivité =|
                    return search(wordsearch, instance, type,source, step, offset,  limit, result)

                }else{

                    result["count"] = response.data.count
                    return result
                }
                    }
            }
        ).catch(function(thrown) {
            if (axios.isCancel(thrown)) {
                let data = {
                    'cancel' : true
                }
                console.log('Request canceled', thrown.message);
                return data 
            }
          })
    }
}

function searchSeeMore(id){

    return axios.get(`http://musicbrainz.org/ws/2/recording/${id}?inc=genres+ratings+artists+releases`)
    .then(async function (response) {
        if(response.status === 200 && response.data){
            let result = {
                "album" : [],
                "artists" : [],
                "duree" : 0,
                "cover" : [],
                "error" : "",
                "rating" : "",
                "genres" : []
            }
            let dateObj = new Date(response.data.length); 
            let minutes = dateObj.getUTCMinutes(); 
            let seconds = dateObj.getSeconds(); 
    
            let timeString = minutes.toString().padStart(2, '0') 
                + ':' + seconds.toString().padStart(2, '0'); 

            
            result["album"] = response.data.releases
            result["artists"] = response.data["artist-credit"]
            result["duree"] = timeString
            result["rating"] =  response.data.rating.value
            result["genres"] =  response.data["artist-credit"][0].artist.genres
            
            return  result
            
        }
    })
}

async function searchCover(result, offset, cover){
    let ids = []
    result["album"].forEach(data => {
        ids.push(data.id)
    })
    if(offset+1 <= ids.length){
        return await axios.get(`https://coverartarchive.org/release/${ids[offset]}`)
        .then(function(response){
            if(response.status === 200 && response.data){
                for (const image of response.data.images) {
                    cover.push(image.thumbnails)
                    
                }
                offset++
                if(offset+1 <= ids.length){
                    sleep(600)
                    return searchCover(result,offset, cover)
                }else{
                    result["cover"] = cover
                    return result
                }
            }
        } ).catch(error => {
            result["error"] = error
            offset++
            if(offset+1 <= ids.length){
                sleep(600)
                return searchCover(result,offset, cover)
            }else{
                result["cover"] = cover
                return result
            }
        })
    }

}

export {searchSeeMore, searchCover , search}