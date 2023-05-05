import { ParsedValues, alarmCoilsMap, defaultValues, eCoil, eHolding } from "./constants";
import { eAppError, errorMessages } from "@/utils/mapErrors";
import { formatInt16, int16ToBool } from "./numberHelper";

type Data = {
  id: string;
  rssi: number;
  holding: eHolding[];
  coil: number[];
};

function parseData(message: string): ParsedValues {
  const result = JSON.parse(JSON.stringify(defaultValues)) as ParsedValues;

  try {
    const data: Data = JSON.parse(message.toString()) as Data;
    result.serial = data.id;
    result.rssi = data.rssi;
    result.errors = [];
    result.main.temp1 = formatInt16(data.holding[eHolding["({Link2}1@W40001)"]], 3, 1);
    result.main.temp2 = formatInt16(data.holding[eHolding["({Link2}1@W40002)"]], 3, 1);
    result.main.temp3 = formatInt16(data.holding[eHolding["({Link2}1@W40003)"]], 3, 1);
    result.main.temp4 = formatInt16(data.holding[eHolding["({Link2}1@W40004)"]], 3, 1);
    result.main.temp5 = formatInt16(data.holding[eHolding["({Link2}1@W40005)"]], 3, 1);
    result.main.tempM = formatInt16(data.holding[eHolding["({Link2}1@W40006)"]], 3, 1);
    result.main.tempA = formatInt16(data.holding[eHolding["({Link2}1@W40007)"]], 3, 1);
    result.main.umid = formatInt16(data.holding[eHolding["({Link2}1@W40008)"]], 3, 1);
    result.main.pressure = formatInt16(data.holding[eHolding["({Link2}1@W40009)"]], 3, 1);
    result.main.day = formatInt16(data.holding[eHolding["({Link2}1@W40010)"]], 3, 0);
    result.main.co2 = formatInt16(data.holding[eHolding["({Link2}1@W40011)"]], 3, 0);

    result.outputs.minimumVentilation = int16ToBool(data.coil[eCoil["({Link2}1@B1)"]]);
    result.outputs.exhaust1 = int16ToBool(data.coil[eCoil["({Link2}1@B2)"]]);
    result.outputs.exhaust2 = int16ToBool(data.coil[eCoil["({Link2}1@B3)"]]);
    result.outputs.exhaust3 = int16ToBool(data.coil[eCoil["({Link2}1@B4)"]]);
    result.outputs.exhaust4 = int16ToBool(data.coil[eCoil["({Link2}1@B5)"]]);
    result.outputs.exhaust5 = int16ToBool(data.coil[eCoil["({Link2}1@B6)"]]);
    result.outputs.exhaust6 = int16ToBool(data.coil[eCoil["({Link2}1@B7)"]]);
    result.outputs.exhaust7 = int16ToBool(data.coil[eCoil["({Link2}1@B8)"]]);
    result.outputs.exhaust8 = int16ToBool(data.coil[eCoil["({Link2}1@B9)"]]);
    result.outputs.exhaust9 = int16ToBool(data.coil[eCoil["({Link2}1@B10)"]]);
    result.outputs.exhaust10 = int16ToBool(data.coil[eCoil["({Link2}1@B11)"]]);
    result.outputs.exhaust11 = int16ToBool(data.coil[eCoil["({Link2}1@B12)"]]);
    result.outputs.exhaust12 = int16ToBool(data.coil[eCoil["({Link2}1@B13)"]]);
    result.outputs.exhaust13 = int16ToBool(data.coil[eCoil["({Link2}1@B14)"]]);
    result.outputs.exhaust14 = int16ToBool(data.coil[eCoil["({Link2}1@B15)"]]);
    result.outputs.exhaust15 = int16ToBool(data.coil[eCoil["({Link2}1@B16)"]]);
    result.outputs.curtainOpen = int16ToBool(data.coil[eCoil["({Link2}1@B17)"]]);
    result.outputs.curtainClose = int16ToBool(data.coil[eCoil["({Link2}1@B18)"]]);
    result.outputs.inletOpen = int16ToBool(data.coil[eCoil["({Link2}1@B19)"]]);
    result.outputs.inletClose = int16ToBool(data.coil[eCoil["({Link2}1@B20)"]]);
    result.outputs.heater1 = int16ToBool(data.coil[eCoil["({Link2}1@B21)"]]);
    result.outputs.heater2 = int16ToBool(data.coil[eCoil["({Link2}1@B22)"]]);
    result.outputs.heater3 = int16ToBool(data.coil[eCoil["({Link2}1@B23)"]]);
    result.outputs.heater4 = int16ToBool(data.coil[eCoil["({Link2}1@B24)"]]);
    result.outputs.evaporativePlate = int16ToBool(data.coil[eCoil["({Link2}1@B25)"]]);
    result.outputs.nebulizer = int16ToBool(data.coil[eCoil["({Link2}1@B26)"]]);
    result.outputs.circulator = int16ToBool(data.coil[eCoil["({Link2}1@B27)"]]);
    result.outputs.lighting = int16ToBool(data.coil[eCoil["({Link2}1@B28)"]]);

    result.errors = alarmCoilsMap
      .map((coilIndex) => {
        if (data.coil[coilIndex] === 1) return errorMessages[coilIndex];
        return "";
      })
      .filter(Boolean);
  } catch (error) {
    console.log(error);
    result.errors = [errorMessages[eAppError.INVALID_PAYLOAD]];
    void error;
  }
  return result;
}

export { defaultValues, parseData };
