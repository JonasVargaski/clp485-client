"use client";
import { OutputIndicator } from "@/components/OutputIndicator";
import { TempIndicator } from "@/components/TempIndicator";
import Marquee from "react-fast-marquee";

import mqtt, { IClientOptions } from "mqtt";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ParsedValues, defaultValues } from "@/utils/constants";
import { parseData } from "@/utils/parseValues";
import { WifiIndicator } from "@/components/WifiIndicator";
import { eAppError, errorMessages } from "@/utils/mapErrors";

const watchDogMqttTimeout = 10 * 1000;

export default function Home() {
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<ParsedValues>(() => defaultValues);

  const topic: string = "c5d81ff2/device/44BF713C";
  const host: string = "wss://mqtt-dashboard.com:8884/mqtt";
  const options: IClientOptions = {
    keepalive: 60,
    clientId: "mqtt_client_" + Math.random().toString(16).substring(2, 8),
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 15 * 1000,
    will: {
      topic: "WillMsg",
      payload: "Connection Closed abnormally..!",
      qos: 0,
      retain: false,
    },
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setData(() => ({
        ...defaultValues,
        errors: [errorMessages[eAppError.CONECTION_TIMEOUT]],
      }));
    }, watchDogMqttTimeout);

    if (!clientRef.current) {
      clientRef.current = mqtt.connect(host, options);
      clientRef.current.subscribe(topic);
      clientRef.current.on("message", (_, message) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const parsedData = parseData(message.toString());
        setData(parsedData);
        timerRef.current = setTimeout(() => {
          setData(() => ({
            ...defaultValues,
            errors: [errorMessages[eAppError.CONECTION_LOOSE]],
          }));
        }, watchDogMqttTimeout);
      });
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.unsubscribe(topic);
        clientRef.current.end(true, clientRef.current);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center p-4 min-w-[875px]">
      <main className="max-w-4xl w-full border rounded-md  bg-gray-900">
        <div className="flex items-center px-3 w-full h-11 gap-4">
          <WifiIndicator rssi={data.rssi} />

          {data.errors.length > 0 && (
            <>
              <Image src="/warning.svg" alt="icon" width={18} height={18} />
              <Marquee speed={80} className="text-base font-semibold text-yellow-500 truncate uppercase w-full">
                {data.errors.join(" | ")}
              </Marquee>
            </>
          )}
        </div>

        <table className="uppercase font-semibold text-center text-white w-full px-1">
          <thead>
            <tr className="text-black">
              <th className="border border-gray-600 h-10 w-1/6 bg-yellow-200">Sensor temp.</th>
              <th className="border border-gray-600 w-1/4 bg-pink-500">Temperatura média</th>
              <th className="border border-gray-600 w-1/4 bg-blue-300">Umidade</th>
              <th className="border border-gray-600 w-1/4 bg-cyan-400">Dia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TempIndicator sensor={1} value={data.main.temp1} />
              <td rowSpan={3} className="text-5xl border border-gray-600">
                {data.main.tempM} °C
              </td>
              <td rowSpan={2} className="text-4xl border border-gray-600">
                {data.main.umid} %
              </td>
              <td rowSpan={2} className="text-4xl border border-gray-600 normal-case">
                {data.main.day}
              </td>
            </tr>
            <tr>
              <TempIndicator sensor={2} value={data.main.temp2} />
            </tr>
            <tr>
              <TempIndicator sensor={3} value={data.main.temp3} />
              <td className="w-1/4 bg-green-300 text-black font-bold border border-gray-600">Pressão</td>
              <td className="w-1/4 bg-orange-200 text-black font-bold border border-gray-600">Co2</td>
            </tr>
            <tr>
              <TempIndicator sensor={4} value={data.main.temp4} />
              <td className="w-1/4 bg-gray-300 text-black font-bold border border-gray-600">Temp. Ajustada</td>
              <td rowSpan={2} className="text-4xl border border-gray-600 normal-case">
                {data.main.pressure} Pa
              </td>
              <td rowSpan={2} className="text-4xl border border-gray-600 normal-case">
                {data.main.co2} ppm
              </td>
            </tr>
            <tr>
              <TempIndicator sensor={5} value={data.main.temp5} />
              <td className="text-lg font-semibold border border-gray-600">{data.main.tempA} °C</td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-4 py-2 px-3 pt-2 border-t-2 border-gray-600">
          <div className="flex flex-col gap-1">
            <OutputIndicator title="Ventilação minima" enabled={data.outputs.minimumVentilation} />
            <OutputIndicator title="Exaustor 1" enabled={data.outputs.exhaust1} />
            <OutputIndicator title="Exaustor 2" enabled={data.outputs.exhaust2} />
            <OutputIndicator title="Exaustor 3" enabled={data.outputs.exhaust3} />
          </div>
          <div className="flex flex-col gap-1">
            <OutputIndicator title="Exaustor 4" enabled={data.outputs.exhaust4} />
            <OutputIndicator title="Exaustor 5" enabled={data.outputs.exhaust5} />
            <OutputIndicator title="Exaustor 6" enabled={data.outputs.exhaust6} />
            <OutputIndicator title="Exaustor 7" enabled={data.outputs.exhaust7} />
          </div>
          <div className="flex flex-col gap-1">
            <OutputIndicator title="Exaustor 8" enabled={data.outputs.exhaust8} />
            <OutputIndicator title="Exaustor 9" enabled={data.outputs.exhaust9} />
            <OutputIndicator title="Exaustor 10" enabled={data.outputs.exhaust10} />
            <OutputIndicator title="Exaustor 11" enabled={data.outputs.exhaust11} />
          </div>
          <div className="flex flex-col gap-1">
            <OutputIndicator title="Exaustor 12" enabled={data.outputs.exhaust12} />
            <OutputIndicator title="Exaustor 13" enabled={data.outputs.exhaust13} />
            <OutputIndicator title="Exaustor 14" enabled={data.outputs.exhaust14} />
            <OutputIndicator title="Exaustor 15" enabled={data.outputs.exhaust15} />
          </div>
        </div>
        <div className="grid grid-cols-4 w-full border-t border-gray-600 py-2 px-3">
          <div className="flex flex-col gap-1">
            <OutputIndicator title="Cortina abre" enabled={data.outputs.curtainOpen} />
            <OutputIndicator title="Cortina fecha" enabled={data.outputs.curtainClose} />
            <OutputIndicator title="Inlet abre" enabled={data.outputs.inletOpen} />
            <OutputIndicator title="Inlet fecha" enabled={data.outputs.inletClose} />
          </div>
          <div className="flex flex-col gap-1">
            <OutputIndicator title="Aquecedor 1" enabled={data.outputs.heater1} />
            <OutputIndicator title="Aquecedor 2" enabled={data.outputs.heater2} />
            <OutputIndicator title="Aquecedor 3" enabled={data.outputs.heater3} />
            <OutputIndicator title="Aquecedor 4" enabled={data.outputs.heater4} />
          </div>
          <div className="flex flex-col gap-1">
            <OutputIndicator title="Placa evaporativa" enabled={data.outputs.evaporativePlate} />
            <OutputIndicator title="Nebulizador" enabled={data.outputs.nebulizer} />
            <OutputIndicator title="Circulador pinteira" enabled={data.outputs.circulator} />
            <OutputIndicator title="Iluminação" enabled={data.outputs.lighting} />
          </div>
        </div>
      </main>
    </div>
  );
}
