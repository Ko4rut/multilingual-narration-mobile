/** Shared narration-language preference for Settings and QR playback. */
import { File, Paths } from "expo-file-system";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

import { DEFAULT_SETTINGS_PREFERENCES } from "../constants/preferences";
import { MOCK_LANGUAGE_OPTIONS } from "../data/mock-settings-options";

const STORAGE_KEY = "mnr.narration.languageId";
const STORAGE_FILE = "mnr-narration-language.txt";

type LanguagePreference = {
  selectedLanguageId: string;
  languageCode: string;
  setSelectedLanguageId: (languageId: string) => void;
  isReady: boolean;
};

const LanguagePreferenceContext = createContext<LanguagePreference | null>(null);

function isKnownLanguageId(value: string): boolean {
  return MOCK_LANGUAGE_OPTIONS.some((option) => option.id === value);
}

function getApiLanguageCode(languageId: string): string {
  const code =
    MOCK_LANGUAGE_OPTIONS.find((option) => option.id === languageId)?.code ??
    "en";
  // QR Resolve currently accepts two- or three-letter codes (e.g. zh, not zh-CN).
  return code.toLowerCase().split("-")[0];
}

async function loadLanguageId(): Promise<string | null> {
  if (Platform.OS === "web") {
    return typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;
  }

  const file = new File(Paths.document, STORAGE_FILE);
  return file.exists ? (await file.text()).trim() : null;
}

async function saveLanguageId(languageId: string): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, languageId);
    }
    return;
  }

  const file = new File(Paths.document, STORAGE_FILE);
  if (!file.exists) {
    file.create();
  }
  await file.write(languageId);
}

export function LanguagePreferenceProvider({ children }: { children: ReactNode }) {
  const [selectedLanguageId, setLanguageId] = useState<string>(
    DEFAULT_SETTINGS_PREFERENCES.languageId,
  );
  const [isReady, setIsReady] = useState(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let mounted = true;

    void loadLanguageId()
      .then((languageId) => {
        if (mounted && languageId && isKnownLanguageId(languageId)) {
          setLanguageId(languageId);
        }
      })
      .catch((error: unknown) => {
        console.warn("Unable to restore narration language:", error);
      })
      .finally(() => {
        if (mounted) {
          setIsReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setSelectedLanguageId = useCallback((languageId: string) => {
    if (!isKnownLanguageId(languageId)) {
      return;
    }
    setLanguageId(languageId);

    // Serialize writes so quick language changes are saved in the right order.
    saveQueue.current = saveQueue.current
      .then(() => saveLanguageId(languageId))
      .catch((error: unknown) => {
        console.warn("Unable to save narration language:", error);
      });
  }, []);

  return (
    <LanguagePreferenceContext.Provider
      value={{
        selectedLanguageId,
        languageCode: getApiLanguageCode(selectedLanguageId),
        setSelectedLanguageId,
        isReady,
      }}
    >
      {children}
    </LanguagePreferenceContext.Provider>
  );
}

export function useLanguagePreference(): LanguagePreference {
  const preference = useContext(LanguagePreferenceContext);
  if (preference === null) {
    throw new Error("useLanguagePreference requires LanguagePreferenceProvider");
  }
  return preference;
}
