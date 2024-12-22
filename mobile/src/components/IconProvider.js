import React, { useMemo } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Zocial from 'react-native-vector-icons/Zocial'

import { getIconName } from '../utils/getIconName'
import { MCC_ICON_NAMES } from '../constants/mccIconNames'
import { CATEGORY_ICONS } from '../constants/categoryIcons'

// Map icon libraries to their glyph maps
const iconLibraryMap = {
    AntDesign: { component: AntDesign, glyphMap: AntDesign.getRawGlyphMap() },
    Entypo: { component: Entypo, glyphMap: Entypo.getRawGlyphMap() },
    EvilIcons: { component: EvilIcons, glyphMap: EvilIcons.getRawGlyphMap() },
    Feather: { component: Feather, glyphMap: Feather.getRawGlyphMap() },
    FontAwesome: { component: FontAwesome, glyphMap: FontAwesome.getRawGlyphMap() },
    FontAwesome5: { component: FontAwesome5, glyphMap: FontAwesome5.getRawGlyphMap() },
    FontAwesome6: { component: FontAwesome6, glyphMap: FontAwesome6.getRawGlyphMap() },
    Fontisto: { component: Fontisto, glyphMap: Fontisto.getRawGlyphMap() },
    Foundation: { component: Foundation, glyphMap: Foundation.getRawGlyphMap() },
    Ionicons: { component: Ionicons, glyphMap: Ionicons.getRawGlyphMap() },
    MaterialCommunityIcons: { component: MaterialCommunityIcons, glyphMap: MaterialCommunityIcons.getRawGlyphMap() },
    MaterialIcons: { component: MaterialIcons, glyphMap: MaterialIcons.getRawGlyphMap() },
    Octicons: { component: Octicons, glyphMap: Octicons.getRawGlyphMap() },
    SimpleLineIcons: { component: SimpleLineIcons, glyphMap: SimpleLineIcons.getRawGlyphMap() },
    Zocial: { component: Zocial, glyphMap: Zocial.getRawGlyphMap() },
}

// Utility to get the correct icon component based on the icon name
function getIconComponent(iconName) {
    for (const { component, glyphMap } of Object.values(iconLibraryMap)) {
        if (glyphMap[iconName]) {
            return component
        }
    }
    console.warn(`Icon "${iconName}" not found in any library, using fallback icon.`)
    return Ionicons // Fallback icon library
}

export const IconProvider = React.memo(({ mccCode, category }) => {
    const iconName = mccCode 
        ? getIconName(mccCode, MCC_ICON_NAMES) 
        : getIconName(category, CATEGORY_ICONS)

    const IconComponent = useMemo(() => getIconComponent(iconName), [iconName])

    return <IconComponent name={iconName} size={24} color="#f6b93b" />
})
