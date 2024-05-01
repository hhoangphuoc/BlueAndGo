//shared functions

/*write data to arduino
    - ID: id of the button
    - command: command to send to the button: 
        1: questions (when the button is pushed)
        2: stop (stop receiving the questions signal)
        3: end (when the game is over, this should be set to all the buttons)
        4: start (when the game is started, this should be set to all the buttons)
        5: (Not used)
        6: correct (when the answer is correct, this send to the button to change color)
        7: wrong (when the answer is wrong, this send to the button to change color)
*/

export let writer
export let reader
export let connected
let port

export let syncTeamsData = []
export async function connect() {
    // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
    const filters = [
        { usbVendorId: 0x1a86, usbProductId: 0x7523 },
        { usbVendorId: 0x10c4, usbProductId: 0xea60 },
    ]
    try {
        if (port === undefined) {
            port = await navigator.serial.requestPort({ filters })
        }
        const { usbProductId, usbVendorId } = port.getInfo()

        console.log(usbProductId)
        console.log(usbVendorId)

        // Wait for the serial port to open.

        await port.open({ baudRate: 115200, dataBits: 8 })
        reader = port.readable.getReader()
        writer = port.writable.getWriter()

        if (reader !== null && writer !== null) {
            connected = true
        }
        return { reader, writer, connected }
    } catch (error) {
        console.log('port not connected')
        alert('Please connect the device')
    }
}

export function writeData(ID, command) {
    try {
        const data = new Uint8Array([ID * 8 + command])
        writer.write(data)
        console.log(data)
        console.log('sent')
        // writer.releaseLock()
    } catch (error) {
        console.log('port not initialized')
    }
}
export const courseThumbnail = require('../images/coursepage-image.svg')
export const goldMedal = require('../images/Gold.svg')
export const silverMedal = require('../images/Silver.svg')
export const bronzeMedal = require('../images/Bronze.svg')
export const educationPack = require('../images/educationpack.svg')
