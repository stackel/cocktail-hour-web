/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import {emphasize} from '@material-ui/core/styles/colorManipulator';

import {database} from 'utils/firebase'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: 0
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08,
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({
  inputRef,
  ...props
}) {
  return <div ref={inputRef} {...props}/>;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}/>
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected
          ? 500
          : 400
      }}
      {...props.innerProps}>
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {
        ...props.removeProps
      } />
}/>
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class IntegrationReactSelect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      allTags: []
    }
  }

  handleChange = value => {
    this.props.onChange(value)
  };

  componentDidMount() {
    if(this.props.defaultValue) {
      this.handleChange(this.props.defaultValue);
    }
    if(!this.props.noTags) {
      if (localStorage.getItem('allTags')) {
        this.setState({
          allTags: JSON.parse(localStorage.getItem('allTags')).map(obj => {
            return {value: obj.name, label: obj.label}
          })
        })
      }

      database.collection("tags").orderBy("name").onSnapshot(snapshot => {
        const tags = []
        snapshot.forEach(doc => {
          let tag = doc.data()
          tag.id = doc.id
          tags.push(tag);
        })

        if (tags.length > 0) {
          localStorage.setItem('allTags', JSON.stringify(tags))
          this.setState({
            allTags: tags.map(obj => {
              return {value: obj.name, label: obj.label}
            })
          });
        }
      })
    }


    if (localStorage.getItem('allIngredients')) {
      this.setState({
        allIngredients: JSON.parse(localStorage.getItem('allIngredients')).map(obj => {
          return {value: obj.name, label: obj.label}
        })
      })
    }

    database.collection("ingredients").orderBy("name").onSnapshot(snapshot => {
      const ingredients = []
      snapshot.forEach(doc => {
        let ingredient = doc.data()
        ingredient.id = doc.id
        ingredients.push(ingredient);
      })
      if (ingredients.length > 0) {
        localStorage.setItem('allIngredients', JSON.stringify(ingredients))

        this.setState({
          allIngredients: ingredients.map(obj => {
            return {value: obj.name, label: obj.label}
          })
        })
      }
    })
  }

  render() {
    const {classes, theme} = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary
      })
    };

    if (!this.state.allTags || !this.state.allIngredients || !this.props.drinks) {
      return null
    }

    return (
      <div className={classes.root}>
        <NoSsr>
          <div className={classes.divider}/>
          <Select
            classes={classes}
            styles={selectStyles}
            defaultValue={this.props.defaultValue}
            textFieldProps={{
              label: 'Search',
              InputLabelProps: {
                shrink: true
              }
            }}
            components={components}
            options={this.state.allTags.concat(this.state.allIngredients).concat(this.props.drinks.map(obj => {
              return {label: obj.name, value: obj.id}
            }))}
            onChange={this.handleChange}
            placeholder="Select tags, ingredients, name"
            isMulti/>
        </NoSsr>
      </div>
    );
  }
}
IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default withStyles(styles, {withTheme: true})(IntegrationReactSelect);
