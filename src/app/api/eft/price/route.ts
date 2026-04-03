type Editions = 'arena' | 'standard' | 'left_behind' | 'prepare_for_escape' | 'the_unheard'
type Expansions = 'pve' | 'stash'
type Regions = 'latam' | 'usa'

interface ProductPrice {
  price: number,
  tax: number,
}

interface PriceList {
  editions: Partial<Record<Editions, number>>,
  expansions: Partial<Record<Expansions, number>>,
}

interface DolarApiResponseValue {
  compra: number,
  venta: number,
  casa: string,
  nombre: string,
  moneda: string,
  fechaActualizacion: string,
}

export async function GET() {
  const editionPricesLATAM: Record<Editions, ProductPrice> = {
    arena: { price: 15, tax: 1 },
    standard: { price: 20, tax: 1.14 },
    left_behind: { price: 32, tax: 1.7 },
    prepare_for_escape: { price: 45, tax: 1.26 },
    the_unheard: { price: 125, tax: 5.54 },
  }
  const editionPricesUSA: Record<Editions, ProductPrice> = {
    arena: { price: 35, tax: 1.36 },
    standard: { price: 50, tax: 1.81 },
    left_behind: { price: 82, tax: 2.76 },
    prepare_for_escape: { price: 110, tax: 3.60 },
    the_unheard: { price: 250, tax: 4.00 },
  }
  const expansionPricesLATAM: Record<Expansions, ProductPrice> = {
    pve: { price: 7, tax: 0.5 },
    stash: { price: 1, tax: 0.3 },
  }
  const expansionPricesUSA: Record<Expansions, ProductPrice> = {
    pve: { price: 20, tax: 0.96 },
    stash: { price: 3, tax: 0.4 },
  }
  const nationalTax = 1.21 // Impuestos percepción + IVA
  const res = await fetch('https://dolarapi.com/v1/dolares', { cache: 'force-cache', next: { revalidate: 60 } }) 
  const values: DolarApiResponseValue[] = await res.json()
  const officialValue = values.find((value) => value.casa === 'oficial')
  const usdValue = officialValue?.venta || 0 // Valor del dólar oficial más reciente
  const calculatePrice = ({ price, tax }: ProductPrice): number => ((price + tax) * usdValue) * nationalTax

  if (usdValue) {
    const prices: Record<Regions, PriceList> = {
      latam: {
        editions: {},
        expansions: {},
      },
      usa: {
        editions: {},
        expansions: {},
      },
    }

    Object.keys(editionPricesLATAM).map((edition) => {
      prices.latam.editions[edition as Editions] = calculatePrice(editionPricesLATAM[edition as Editions])
    })
    Object.keys(expansionPricesLATAM).map((expansion) => {
      prices.latam.expansions[expansion as Expansions] = calculatePrice(expansionPricesLATAM[expansion as Expansions])
    })
    Object.keys(editionPricesUSA).map((edition) => {
      prices.usa.editions[edition as Editions] = calculatePrice(editionPricesUSA[edition as Editions])
    })
    Object.keys(expansionPricesUSA).map((expansion) => {
      prices.usa.expansions[expansion as Expansions] = calculatePrice(expansionPricesUSA[expansion as Expansions])
    })

    return Response.json({ prices, nationalTax, usdValue })
  } else {
    return new Response('Internal error', { status: 500 })
  }

}