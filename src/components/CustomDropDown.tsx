import React, { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { Dropdown, Form, FormControl, Toast } from 'react-bootstrap';
import classes from './CustomDropDown.module.scss';
import { FieldHookConfig, useField } from 'formik';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleDown} from "@fortawesome/free-regular-svg-icons";

export interface IDropDownItem {
    key: string,
    value: string,
    disabled? : boolean
}
export interface ICustomDropDownProps {
    id?: string;
    search?: boolean;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    title?: string;
    className?: string;
    items: IDropDownItem[];
    selectedItems: IDropDownItem[];
    onItemSelect?(values: IDropDownItem[]): void;
}

export interface CustomToggleProps {
    children?: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {};
}

export interface CustomMenuProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    labeledBy?: string;
}

export type EventKey = string | number | undefined | null;

const CustomDropDown = (selectProps: ICustomDropDownProps & FieldHookConfig<IDropDownItem[]>) => {
    const [field, meta, helpers] = useField(selectProps);
    const searchInputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement | null>(null);
    let tempStates = useRef(new Map());

    const CustomToggle = React.forwardRef((props: CustomToggleProps, ref: React.Ref<HTMLDivElement>) => (
        <div className={classes.toggle} ref={ref} onClick={(e) => props.onClick && props.onClick(e)}>
            <span className={classes.header}>{props.children}</span>
            <span>
        <FontAwesomeIcon icon={faArrowAltCircleDown} />
      </span>
        </div>
    ));
    const [value, setValue] = useState('');

    const CustomMenu = React.forwardRef((props: CustomMenuProps, ref: React.Ref<HTMLDivElement>) => {
        return (
            <div ref={ref} style={props.style} className={props.className} aria-labelledby={props.labeledBy} data-bs-popper="static">
                {selectProps.search && (
                    <FormControl
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Recherche"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        ref={searchInputRef}
                    />
                )}
                <ul className={`list-unstyled  ${classes.pureList}`}>
                    {React.Children.toArray(props.children).filter((child: any) => !value || child.props.children.toLowerCase().includes(value.toLowerCase()))}
                </ul>
            </div>
        );
    });
    const [checkedItems, setCheckedItems] = useState(new Map().set('initialState', true));
    const [checked, setChecked] = useState(selectProps.selectedItems);
    const [options, setOptions] = useState(selectProps.items);

    useEffect(() => {
        setOptions(selectProps.items);
    }, [selectProps.items]);

    useEffect(() => {
        setChecked(selectProps.selectedItems);
        if(checkedItems.get('initialState') && selectProps.selectedItems.length) {
            tempStates.current = new Map(selectProps.selectedItems.map((item) => [item?.key, item]));
            setCheckedItems(new Map(tempStates.current));
        }
    }, [selectProps.selectedItems]);

    const focusSearchInput = () => {
        setTimeout(() => searchInputRef.current?.focus(), 0);
    };

    const handleToggle = (open: boolean) => {
        if (open) {
            tempStates.current = new Map(checked.map((item) => [item?.key, item]));
            focusSearchInput();
        } else {
            setCheckedItems(new Map(tempStates.current));
        }
    };

    useEffect(() => {
        if (checkedItems.has('initialState')) return;
        tempStates.current && selectProps.onItemSelect && selectProps.onItemSelect([...checkedItems.values()]);
        helpers.setValue([...checkedItems.values()]);
    }, [checkedItems]);

    const collectStates = (key: EventKey) => {
        const item = options.find((item) => item.key === key) ?? ({} as IDropDownItem);
        item && tempStates.current.set(item.key, item);
    };

    const cls = (...classes: any[]) => classes.filter(Boolean).join(' ');
    const ddClasses = cls(selectProps.disabled && classes.disabled, !meta.error && 'is-valid', !!meta.error && 'is-invalid');

    const removeItem = (key: EventKey) => {
        checkedItems.delete(key);
        setCheckedItems(new Map(checkedItems));
    };

    return (
        <Form.Group className={selectProps.className} controlId={selectProps.id}>
            {selectProps.label && <Form.Label>{selectProps.label}</Form.Label>}
            <Dropdown onToggle={handleToggle} onSelect={(key: EventKey) => collectStates(key)} className={ddClasses}>
                <Dropdown.Toggle name={field.name} as={CustomToggle}>
                    {selectProps.title}
                </Dropdown.Toggle>

                <Dropdown.Menu className={classes.dropDownMenu} as={CustomMenu}>
                    {options.map((item) => {
                        return (
                            <Dropdown.Item disabled={!!item.disabled} className={classes.dropDownItem} as={'div'} key={item.key} eventKey={item.key}>
                                {item.value}
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
            <span className={`${classes.feedback} ${meta.error ? 'invalid-feedback' : 'valid-feedback'}`}>
        <span>{!selectProps.disabled && meta.error}</span>
      </span>
            <div className={`p-1 ${classes.toastContainer}`}>
                {!checkedItems.has('initialState') &&
                    [...checkedItems.values()].map((item) => {
                        return (
                            <Toast className={(selectProps.disabled || !!item.disabled) ? classes.toastDisabled + " " + classes.toast :  classes.toast} onClose={() => removeItem(item.key)} key={item.key}>
                                <Toast.Header className={classes.toastHeader}>
                                    <small>{item.value}</small>
                                </Toast.Header>
                            </Toast>
                        );
                    })}
            </div>
        </Form.Group>
    );
};

CustomDropDown.defaultProps = {
    placeholder: 'Search',
    title: 'Title',
};

export default CustomDropDown;