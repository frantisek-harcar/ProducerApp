import { Button } from "react-bootstrap";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import styleUtils from "../../styles/utils.module.scss"
import styles from "../../styles/Settings.module.scss"
import { useEffect, useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog";

const SettingsPageView = () => {
    const { t } = useTranslation();

    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const [showChangePasswordSuccessMessage, setShowChangePasswordSuccessMessage] = useState(false);

    useEffect(() => {
        if (showChangePasswordSuccessMessage) {
            const timer = setTimeout(() => {
                setShowChangePasswordSuccessMessage(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showChangePasswordSuccessMessage]);

    return (
        <>
            <div className={styles.verticalBox}>
                {showChangePasswordSuccessMessage &&
                    <div className="alert alert-success" role="alert">
                        {t('settings.changePasswordSuccess')}
                    </div>
                }

                <div className="mt-4">
                    <div className="mb-2">
                        {t('settings.language') + ": "}
                    </div>

                    <LanguageSwitcher />
                </div>
                <br />
                <div className="">
                    <Button
                        className={`mb-2 mt-3 ${styleUtils.blockCenter} ${styleUtils.flexCenter} ${styleUtils.buttonColor} ${styleUtils.width100}`}
                        onClick={() => setShowChangePasswordDialog(true)}
                    >
                        {t('settings.changePassword')}
                    </Button>
                </div>
            </div>

            {showChangePasswordDialog &&
                <ChangePasswordDialog
                    onDismiss={() => setShowChangePasswordDialog(false)}
                    onPasswordChanged={() => {
                        setShowChangePasswordDialog(false)
                        setShowChangePasswordSuccessMessage(true)
                    }}
                />
            }


        </>
    );
}

export default SettingsPageView;