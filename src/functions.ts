import * as cheerio from 'cheerio'
import { exec } from 'child_process';
import axios from 'axios';
import * as Papa from 'papaparse';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface curlResponse {
    stdout: string,
    stderr: string
}

const getWebsiteHtml = () => execPromise('curl -s https://www.post.at/en/p/c/delivery-delays-coronavirus');

const getFileLink = (data: curlResponse) => {
    const $ = cheerio.load(data.stdout);
    return $('a[title=Parcels]').attr('href');
};

// this was the only sensible solution to 
const parseFile = (url: string) => new Promise(resolve => {
    axios.get(url, {responseType: 'stream'}).then(res => {
        let result = false;
        Papa.parse(res.data, {
            encoding: 'utf-8',
            step: row => {
                if (row.data[0].toLowerCase() === 'lettland') result = true;
            },
            complete: () => resolve(result)
        });
    });
});

export async function check() {
    // let bot handle errors
    const data: curlResponse = await getWebsiteHtml();
    const link: string = getFileLink(data) || '';
    if (!link) throw new Error('No links was found while parsing html!');

    const result = await parseFile(link);

    return `Latvia is ${result ? 'in Austrian covid-19 parcel ban. :(': 'not in Autstrian covid-19 parcel ban list! :)'}`;
}