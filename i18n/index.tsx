import { I18n } from "i18n-js"

import ar from "./ar"
import en from "./en"
import fr from "./fr"

const i18n = new I18n({
    en,
    ar,
    fr,
})

i18n.enableFallback = true

export default i18n
