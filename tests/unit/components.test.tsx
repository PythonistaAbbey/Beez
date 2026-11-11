import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TempChart } from "@/components/charts/TempChart";

const labels = { title: "Temperature", band: "Allowed band", excursion: "Excursion", elapsed: "Elapsed", hint: "Use arrows" };

describe("TempChart", () => {
  it("labels an excursion in text, not colour alone", () => {
    render(<TempChart readings={[{ t: 0, celsius: 5, humidity: 55 }, { t: 10, celsius: 9.5, humidity: 55 }, { t: 20, celsius: 5, humidity: 55 }]} min={2} max={8} labels={labels} />);
    expect(screen.getByText(/Excursion 9.5 °C/)).toBeInTheDocument();
  });
  it("is keyboard explorable", () => {
    render(<TempChart readings={[{ t: 0, celsius: 5, humidity: 50 }, { t: 10, celsius: 6, humidity: 51 }]} min={2} max={8} labels={labels} />);
    const svg = screen.getByRole("img");
    fireEvent.keyDown(svg, { key: "ArrowLeft" });
    expect(screen.getByText(/5.0 °C/)).toBeInTheDocument();
  });
});
