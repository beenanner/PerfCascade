import {Har,
  Page,
  PageTimings,
  Creator,
  Cookie,
  Request,
  Content,
  Response,
  Timings,
  Entry
} from "../typing/har"
import TimeBlock from '../typing/time-block'
import {
  WaterfallData,
  Mark
} from '../typing/waterfall-data'
import {mimeToCssClass} from './styling-converters'


export default class HarTransformer{
  
  static transfrom(data: Har): WaterfallData {
    console.log("HAR created by %s(%s) of %s page(s)", data.creator.name, data.creator.version, data.pages.length)
    
    //temp - TODO: remove
    window["data"] = data

    //only support one page (first) for now
    const currentPageIndex = 0
    const currPage = data.pages[currentPageIndex]
    const pageStartTime = new Date(currPage.startedDateTime).getTime()

    let doneTime = 0;
    const blocks = data.entries
      .filter(entry => entry.pageref === currPage.id)
      .map((entry) => {
        const startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime

        if (doneTime < (startRelative + entry.time)){
          doneTime = startRelative + entry.time
        }

        const subModules = entry.timings

        return new TimeBlock(entry.request.url, 
          startRelative,
          startRelative + entry.time,
          mimeToCssClass(entry.response.content.mimeType),
          this.buildDetailTimingBlocks(startRelative, entry.timings),
          entry
        )
    })

    const marks = ["onContentLoad", "onLoad"]
      .filter(k => (data.pages[currentPageIndex].pageTimings[k] != undefined && data.pages[currentPageIndex].pageTimings[k] >= 0))
      .map(k => {
        const startRelative = currPage.pageTimings[k]
        
        return {
          "name": k,
          "startTime": startRelative
        } as Mark
    })

    return {
      durationMs: doneTime,
      blocks: blocks,
      marks: marks,
      lines: [],
    }
  }

  static buildDetailTimingBlocks(startRelative: number, t: Timings): Array<TimeBlock> {
    // var timings = []
    return ["blocked", "dns", "connect", "send", "wait", "receive"].reduce((collect: Array<TimeBlock>, key) => {
      if (t[key] && t[key] !== -1){
        const start = (collect.length > 0) ? collect[collect.length - 1].end : startRelative
        

        //special case for 'connect' && 'ssl' since they share time
        //http://www.softwareishard.com/blog/har-12-spec/#timings
        if (key === "connect" && t["ssl"] && t["ssl"] !== -1){
          return collect
            .concat([new TimeBlock("ssl", start, start + t.ssl, "block-ssl")])
            .concat([new TimeBlock(key, start + t.ssl, start + t[key], "block-" + key)])
        }

        return collect.concat([new TimeBlock(key, start, start + t[key], "block-" + key)])
      }
      return collect
    }, [])
  }
}